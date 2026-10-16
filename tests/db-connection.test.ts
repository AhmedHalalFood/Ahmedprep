import { spawnSync } from "node:child_process"
import path from "node:path"
import pg from "pg"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  assertHostConfirmed,
  DatabaseConfigError,
  endpointOf,
  parseMigrationArgs,
  requireDatabaseUrl,
  resolveAppDatabase,
  resolveMigrationTarget,
} from "@/lib/db/connection-config.mjs"

// Fake hosts only (.invalid never resolves). No test opens a connection.
const TEST_POOLED = "postgresql://tester:s3cret@ep-test-1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
const TEST_DIRECT = "postgresql://tester:s3cret@ep-test-1.us-east-1.aws.neon.tech/neondb?sslmode=require"
const PROD_LIKE = { PGHOST: "prod.invalid", PGUSER: "produser", PGPASSWORD: "prodpass", PGDATABASE: "proddb", PGPORT: "6543" }

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

function configError(fn: () => unknown) {
  try {
    fn()
  } catch (error) {
    expect(error).toBeInstanceOf(DatabaseConfigError)
    return (error as Error).message
  }
  throw new Error("expected a DatabaseConfigError")
}

describe("requireDatabaseUrl: missing or invalid values", () => {
  it.each([
    ["unset", undefined, /is not set/],
    ["empty", "", /is not set/],
    ["whitespace", "   ", /is not set/],
    ["an 11-character placeholder", "placeholder", /not a valid URL/],
    ["a bare host", "ep-test-1.neon.tech", /not a valid URL/],
    ["the wrong scheme", "mysql://u:p@h/db", /must start with postgresql/],
    ["no user", "postgresql://h.invalid/db", /no user name/],
    ["no password", "postgresql://u@h.invalid/db", /no password/],
    ["no database", "postgresql://u:p@h.invalid", /exactly one database/],
    ["only a slash", "postgresql://u:p@h.invalid/", /exactly one database/],
    ["a nested path", "postgresql://u:p@h.invalid/a/b", /exactly one database/],
  ])("rejects %s", (_label, value, message) => {
    expect(configError(() => requireDatabaseUrl({ DATABASE_URL: value }, "DATABASE_URL"))).toMatch(message)
  })

  it.each(["host", "hostaddr", "port", "user", "password", "dbname", "database", "service", "passfile"])(
    "rejects a %s query parameter that would override the URL",
    (param) => {
      const value = `postgresql://u:p@h.invalid/db?${param}=prod.invalid`
      expect(configError(() => requireDatabaseUrl({ DATABASE_URL: value }, "DATABASE_URL"))).toMatch(param)
    },
  )

  it("never echoes the password or full value in an error", () => {
    const message = configError(() => requireDatabaseUrl({ X: "postgresql://u:topsecret@h.invalid" }, "X"))
    expect(message).not.toContain("topsecret")
  })

  it("accepts a complete URL and pins the default port", () => {
    const target = requireDatabaseUrl({ DATABASE_URL: "postgresql://u:p@H.invalid/neondb?sslmode=require" }, "DATABASE_URL")
    expect(target).toMatchObject({ host: "h.invalid", port: "5432", database: "neondb", user: "u" })
    expect(target.connectionString).toContain(":5432/neondb")
  })
})

describe("no fallback to PG* variables or other connection strings", () => {
  it("the app ignores POSTGRES_URL, DATABASE_URL_UNPOOLED, and PG* when DATABASE_URL is missing", () => {
    const env = { ...PROD_LIKE, POSTGRES_URL: TEST_POOLED, DATABASE_URL_UNPOOLED: TEST_DIRECT }
    expect(configError(() => resolveAppDatabase(env))).toMatch(/DATABASE_URL is not set/)
  })

  it("migrations do not fall back to DATABASE_URL when DATABASE_URL_UNPOOLED is missing", () => {
    const env = { ...PROD_LIKE, DATABASE_URL: TEST_POOLED, POSTGRES_URL_NON_POOLING: TEST_DIRECT }
    expect(configError(() => resolveMigrationTarget(env))).toMatch(/DATABASE_URL_UNPOOLED is not set/)
  })

  it("node-postgres uses only the validated URL even with production PG* values in the environment", async () => {
    for (const [key, value] of Object.entries(PROD_LIKE)) vi.stubEnv(key, value)
    const { connectionString } = requireDatabaseUrl({ DATABASE_URL: TEST_POOLED }, "DATABASE_URL")
    // Client builds its ConnectionParameters (including PG* defaults) in the constructor; nothing connects here.
    const client = new pg.Client({ connectionString }) as unknown as Record<string, unknown>
    expect(client).toMatchObject({
      host: "ep-test-1-pooler.us-east-1.aws.neon.tech",
      user: "tester",
      database: "neondb",
      port: 5432,
    })
    expect(client.password).toBe("s3cret")
  })

  it("documents the risk: without validation, an incomplete URL inherits production PG* values", () => {
    for (const [key, value] of Object.entries(PROD_LIKE)) vi.stubEnv(key, value)
    const client = new pg.Client({ connectionString: "postgresql://ep-test-1.invalid" }) as unknown as Record<string, unknown>
    expect(client).toMatchObject({ user: "produser", database: "proddb" })
  })

  it("lib/db getDb() throws a config error, at first use rather than import, when DATABASE_URL is invalid", async () => {
    for (const [key, value] of Object.entries(PROD_LIKE)) vi.stubEnv(key, value)
    vi.stubEnv("DATABASE_URL", "placeholder")
    const { getDb } = await import("@/lib/db")
    // resetModules loads a fresh copy of the class, so match on the error code rather than instanceof.
    expect(() => getDb()).toThrow(expect.objectContaining({ code: "DB_CONFIG_INVALID", name: "DatabaseConfigError" }))
  })
})

describe("resolveMigrationTarget", () => {
  it("uses the direct URL when the pooled URL points at the same endpoint and database", () => {
    const target = resolveMigrationTarget({ DATABASE_URL: TEST_POOLED, DATABASE_URL_UNPOOLED: TEST_DIRECT })
    expect(target).toMatchObject({ variable: "DATABASE_URL_UNPOOLED", host: "ep-test-1.us-east-1.aws.neon.tech", database: "neondb" })
  })

  it("refuses when the app and migration URLs point at different endpoints", () => {
    const env = { DATABASE_URL: TEST_POOLED, DATABASE_URL_UNPOOLED: "postgresql://u:p@ep-prod-9.us-east-1.aws.neon.tech/neondb" }
    expect(configError(() => resolveMigrationTarget(env))).toMatch(/point at different databases/)
  })

  it("refuses when they name different databases on the same endpoint", () => {
    const env = { DATABASE_URL: TEST_POOLED, DATABASE_URL_UNPOOLED: TEST_DIRECT.replace("/neondb", "/otherdb") }
    expect(configError(() => resolveMigrationTarget(env))).toMatch(/point at different databases/)
  })

  it("refuses when DATABASE_URL is set but invalid", () => {
    const env = { DATABASE_URL: "placeholder", DATABASE_URL_UNPOOLED: TEST_DIRECT }
    expect(configError(() => resolveMigrationTarget(env))).toMatch(/DATABASE_URL is not a valid URL/)
  })

  it("maps a Neon pooled host to its endpoint", () => {
    expect(endpointOf("ep-x-1-pooler.c-2.aws.neon.tech")).toBe("ep-x-1.c-2.aws.neon.tech")
  })
})

describe("migration host confirmation", () => {
  const target = requireDatabaseUrl({ U: TEST_DIRECT }, "U")

  it("parses --confirm-host in both forms and --dry-run", () => {
    expect(parseMigrationArgs(["--dry-run", "--confirm-host=EP-Test-1.x"])).toEqual({ dryRun: true, confirmHost: "ep-test-1.x" })
    expect(parseMigrationArgs(["--confirm-host", "h"])).toEqual({ dryRun: false, confirmHost: "h" })
    expect(parseMigrationArgs([]).confirmHost).toBeNull()
    expect(parseMigrationArgs(["--confirm-host="]).confirmHost).toBeNull()
  })

  it("refuses without confirmation and tells the operator which host to confirm", () => {
    expect(configError(() => assertHostConfirmed(target, null))).toContain(`--confirm-host=${target.host}`)
  })

  it.each(["ep-test-1", "ep-test-1-pooler.us-east-1.aws.neon.tech", "*.neon.tech", "ep-prod-9.us-east-1.aws.neon.tech"])(
    "refuses a host that is not an exact match: %s",
    (host) => {
      expect(configError(() => assertHostConfirmed(target, host))).toMatch(/does not match/)
    },
  )

  it("accepts the exact host", () => {
    expect(() => assertHostConfirmed(target, "ep-test-1.us-east-1.aws.neon.tech")).not.toThrow()
  })
})

describe("scripts/migrate.mjs exits before connecting", () => {
  // A clean env (no inherited database variables) and an unresolvable host: the script must stop on its own checks.
  function runMigrate(args: string[], env: Record<string, string>) {
    const result = spawnSync(process.execPath, [path.join("scripts", "migrate.mjs"), ...args], {
      cwd: process.cwd(),
      env: { PATH: process.env.PATH ?? "", ...env } as unknown as NodeJS.ProcessEnv,
      encoding: "utf8",
      timeout: 10_000,
    })
    return { status: result.status, out: `${result.stdout}${result.stderr}` }
  }
  const direct = "postgresql://tester:s3cret@ep-test-1.invalid/neondb"

  it("with no connection URL, even when PG* points elsewhere", () => {
    const { status, out } = runMigrate(["--confirm-host=prod.invalid"], PROD_LIKE)
    expect(status).toBe(1)
    expect(out).toContain("DATABASE_URL_UNPOOLED is not set")
  })

  it("without --confirm-host, after printing the target host and database", () => {
    const { status, out } = runMigrate([], { DATABASE_URL_UNPOOLED: direct })
    expect(status).toBe(1)
    expect(out).toMatch(/host\s+ep-test-1\.invalid/)
    expect(out).toMatch(/database\s+neondb/)
    expect(out).toContain("Refusing to migrate without confirmation")
    expect(out).not.toContain("s3cret")
    expect(out).not.toMatch(/ENOTFOUND|Migration failed/)
  })

  it("with a mismatched --confirm-host, including for dry runs", () => {
    const { status, out } = runMigrate(["--dry-run", "--confirm-host=other.invalid"], { DATABASE_URL_UNPOOLED: direct })
    expect(status).toBe(1)
    expect(out).toContain("dry run")
    expect(out).toContain("does not match")
    expect(out).not.toMatch(/ENOTFOUND|Migration failed/)
  })
})
