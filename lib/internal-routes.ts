/**
 * Internal design-preview routes (/enroll, /enroll/seats-preview) are shown only where the
 * deployment environment is positively known to be non-production. Anything else, including
 * VERCEL_ENV=production, an empty or unrecognised value, or a missing value outside `next dev`,
 * fails closed and the route returns 404.
 */
const INTERNAL_PREVIEW_ENVS = new Set(["preview", "development"])

type EnvLike = Record<string, string | undefined>

export function internalPreviewAllowed(env: EnvLike = process.env) {
  const vercelEnv = env.VERCEL_ENV
  if (vercelEnv !== undefined) return INTERNAL_PREVIEW_ENVS.has(vercelEnv)
  // Not on Vercel: only a local `next dev` server counts as a known non-production environment.
  return env.NODE_ENV === "development"
}
