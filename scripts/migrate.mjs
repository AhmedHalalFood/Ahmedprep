// Applies pending SQL files from db/migrations in name order, all in one transaction.
//   pnpm db:migrate          apply pending migrations
//   pnpm db:migrate:check    apply them inside a transaction, report, then roll back (changes nothing)
import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import pg from "pg"

const dryRun = process.argv.includes("--dry-run")
const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
if (!connectionString) {
  console.error("DATABASE_URL is not set.")
  process.exit(1)
}

const dir = path.join(process.cwd(), "db", "migrations")
const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()

const client = new pg.Client({ connectionString })
await client.connect()

try {
  await client.query("BEGIN")
  // Serializes concurrent runs (e.g. two deploys at once); released automatically at COMMIT/ROLLBACK.
  await client.query("SELECT pg_advisory_xact_lock(hashtext('ahmedprep_schema_migrations'))")
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name text PRIMARY KEY,
    checksum text NOT NULL,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`)
  const { rows } = await client.query("SELECT name, checksum FROM schema_migrations")
  const applied = new Map(rows.map((r) => [r.name, r.checksum]))

  let pending = 0
  for (const file of files) {
    const sql = await readFile(path.join(dir, file), "utf8")
    const checksum = createHash("sha256").update(sql).digest("hex")
    if (applied.has(file)) {
      if (applied.get(file) !== checksum) {
        throw new Error(`${file} was changed after it was applied. Add a new migration file instead of editing it.`)
      }
      console.log(`already applied  ${file}`)
      continue
    }
    await client.query(sql)
    await client.query("INSERT INTO schema_migrations (name, checksum) VALUES ($1, $2)", [file, checksum])
    console.log(`${dryRun ? "would apply     " : "applied         "} ${file}`)
    pending++
  }

  if (dryRun) {
    await client.query("ROLLBACK")
    console.log(`Dry run: ${pending} pending migration(s) ran cleanly and were rolled back. Nothing was changed.`)
  } else {
    await client.query("COMMIT")
    console.log(pending ? `Done: ${pending} migration(s) applied.` : "Database is up to date.")
  }
} catch (error) {
  await client.query("ROLLBACK").catch(() => {})
  console.error("Migration failed, nothing was changed:", error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  await client.end()
}
