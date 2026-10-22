import pg from "pg"
const url = process.env.DATABASE_URL
const host = new URL(url).hostname
if (!host.includes("ep-quiet-breeze")) { console.log("ABORT: not preview-test"); process.exit(1) }
console.log("DB endpoint:", host.split(".")[0].replace("-pooler",""), "(preview-test)")
const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false } })
const q = async (s, p) => (await pool.query(s, p)).rows
const rows = await q(`select form_type, coalesce(student_name, contact_name) who, contact_email, delivery_status, delivery_attempts, duplicate_attempts, left(coalesce(last_delivery_error,''),60) err,
  intensive_first_class_date d, intensive_remaining_classes c, intensive_remaining_hours h, intensive_tuition_cents t, payload->>'paymentOption' pay, created_at
  from lead_submissions where (student_name like 'TEST %' or contact_name like 'TEST %') and created_at > now() - interval '6 hours' order by created_at`)
console.table(rows.map(r => ({ ...r, created_at: r.created_at.toISOString().slice(11,19), d: r.d ? new Date(r.d).toISOString().slice(0,10) : null })))
const dupKeys = await q(`select idempotency_key, count(*) n from lead_submissions where created_at > now() - interval '6 hours' group by 1 having count(*) > 1`)
console.log("duplicate idempotency keys stored:", dupKeys.length)
const tables = await q(`select table_name from information_schema.tables where table_schema='public' and table_name ilike '%sunday%'`)
console.log("sunday tables:", tables.map(t => t.table_name).join(","))
for (const { table_name } of tables) {
  const c = await q(`select column_name from information_schema.columns where table_name=$1`, [table_name])
  const names = c.map(x => x.column_name)
  const nameCol = names.find(n => n === "student_name") 
  if (!nameCol) { console.log(table_name, "cols:", names.join(",")); continue }
  const r = await q(`select * from ${table_name} where student_name like 'TEST %' and created_at > now() - interval '6 hours' order by created_at`)
  console.log(table_name, "test rows:", r.length)
  console.table(r.map(x => Object.fromEntries(Object.entries(x).filter(([k]) => /student_name|class_date|class_type|status|email_status|confirmation|created_at|grade/.test(k)).map(([k,v]) => [k, v instanceof Date ? v.toISOString().slice(0,16) : v]))))
}
const rl = await q(`select table_name from information_schema.tables where table_schema='public' and table_name ilike '%rate%'`)
console.log("rate-limit tables:", rl.map(t=>t.table_name).join(","))
await pool.end()
