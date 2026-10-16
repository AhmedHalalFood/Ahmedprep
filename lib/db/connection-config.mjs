// Shared by the app (lib/db/index.ts) and the migration runner (scripts/migrate.mjs), so both apply the same rules.
//
// node-postgres silently fills any part missing from the connection string (host, user, password, database, port)
// from PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT, ~/.pgpass, or localhost. In this project those PG* variables
// point at the live database, so a connection string that is missing, blank, or incomplete could quietly reach
// production. Every check below exists to make that impossible: a URL is accepted only if it names every part itself.

export class DatabaseConfigError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message)
    this.name = "DatabaseConfigError"
    this.code = "DB_CONFIG_INVALID"
  }
}

const PROTOCOLS = new Set(["postgres:", "postgresql:"])
// Query parameters that node-postgres would let override the host, credentials, or database named in the URL.
const OVERRIDE_PARAMS = ["host", "hostaddr", "port", "user", "password", "dbname", "database", "service", "passfile"]
const DEFAULT_PORT = "5432"

/**
 * @typedef {{ variable: string, connectionString: string, host: string, port: string, database: string, user: string }} DatabaseTarget
 */

/**
 * Validates one connection-string variable. Never includes the value or password in an error message.
 * @param {Record<string, string | undefined>} env
 * @param {string} variable
 * @returns {DatabaseTarget}
 */
export function requireDatabaseUrl(env, variable) {
  const raw = env[variable]?.trim()
  if (!raw) throw new DatabaseConfigError(`${variable} is not set. Set it to a full postgresql:// connection URL.`)

  let url
  try {
    url = new URL(raw)
  } catch {
    throw new DatabaseConfigError(`${variable} is not a valid URL. Expected postgresql://user:password@host/database.`)
  }

  if (!PROTOCOLS.has(url.protocol)) {
    throw new DatabaseConfigError(`${variable} must start with postgresql:// or postgres://.`)
  }
  const host = url.hostname.toLowerCase()
  if (!host) throw new DatabaseConfigError(`${variable} has no host.`)
  if (!url.username) throw new DatabaseConfigError(`${variable} has no user name.`)
  if (!url.password) throw new DatabaseConfigError(`${variable} has no password.`)

  const database = decodeURIComponent(url.pathname.replace(/^\//, ""))
  if (!database || database.includes("/")) {
    throw new DatabaseConfigError(`${variable} must name exactly one database after the host (…/neondb).`)
  }

  const override = OVERRIDE_PARAMS.find((name) => url.searchParams.has(name))
  if (override) {
    throw new DatabaseConfigError(`${variable} contains a "${override}" query parameter, which is not allowed.`)
  }

  // Pin the port so PGPORT can't redirect the connection either.
  if (!url.port) url.port = DEFAULT_PORT

  return {
    variable,
    connectionString: url.toString(),
    host,
    port: url.port,
    database,
    user: decodeURIComponent(url.username),
  }
}

/**
 * The app reads DATABASE_URL only.
 * @param {Record<string, string | undefined>} env
 */
export function resolveAppDatabase(env) {
  return requireDatabaseUrl(env, "DATABASE_URL")
}

/**
 * Neon's pooled host is the direct host with "-pooler" added to the endpoint label.
 * @param {string} host
 */
export function endpointOf(host) {
  const [label, ...rest] = host.split(".")
  return [label.replace(/-pooler$/, ""), ...rest].join(".")
}

/**
 * Migrations use the direct (unpooled) connection only; there is deliberately no fallback to DATABASE_URL.
 * If DATABASE_URL is also set it must be valid and point at the same endpoint and database, so the app and the
 * migration can never be split across two databases.
 * @param {Record<string, string | undefined>} env
 */
export function resolveMigrationTarget(env) {
  const target = requireDatabaseUrl(env, "DATABASE_URL_UNPOOLED")
  if (env.DATABASE_URL?.trim()) {
    const app = requireDatabaseUrl(env, "DATABASE_URL")
    if (endpointOf(app.host) !== endpointOf(target.host) || app.database !== target.database) {
      throw new DatabaseConfigError(
        `DATABASE_URL (${app.host}/${app.database}) and DATABASE_URL_UNPOOLED (${target.host}/${target.database}) point at different databases. Fix them before migrating.`,
      )
    }
  }
  return target
}

/**
 * @param {string[]} argv
 * @returns {{ dryRun: boolean, confirmHost: string | null }}
 */
export function parseMigrationArgs(argv) {
  let confirmHost = null
  argv.forEach((arg, i) => {
    if (arg.startsWith("--confirm-host=")) confirmHost = arg.slice("--confirm-host=".length)
    else if (arg === "--confirm-host") confirmHost = argv[i + 1] ?? ""
  })
  return { dryRun: argv.includes("--dry-run"), confirmHost: confirmHost?.trim().toLowerCase() || null }
}

/**
 * The operator must type the exact target host. Accepts nothing looser: no prefixes, wildcards, or the pooled host.
 * @param {DatabaseTarget} target
 * @param {string | null} confirmHost
 */
export function assertHostConfirmed(target, confirmHost) {
  if (!confirmHost) {
    throw new DatabaseConfigError(
      `Refusing to migrate without confirmation. Re-run with --confirm-host=${target.host} after checking it is the intended database.`,
    )
  }
  if (confirmHost !== target.host) {
    throw new DatabaseConfigError(
      `--confirm-host (${confirmHost}) does not match the target host (${target.host}). Nothing was run.`,
    )
  }
}

/** @param {DatabaseTarget} target @param {boolean} dryRun */
export function describeTarget(target, dryRun) {
  return [
    `Migration target (${dryRun ? "dry run, rolled back" : "WILL COMMIT"}):`,
    `  variable  ${target.variable}`,
    `  host      ${target.host}`,
    `  port      ${target.port}`,
    `  database  ${target.database}`,
    `  user      ${target.user}`,
  ].join("\n")
}
