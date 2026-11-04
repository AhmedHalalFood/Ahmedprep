import { notFound } from "next/navigation"
import { connection } from "next/server"
import { internalPreviewAllowed } from "@/lib/internal-routes"

/** Request-time check so a page prerendered elsewhere is never served on Production. */
export async function requireInternalPreview() {
  await connection()
  if (!internalPreviewAllowed()) notFound()
}
