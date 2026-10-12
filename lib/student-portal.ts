/**
 * Student Login appears in navigation only once NEXT_PUBLIC_STUDENT_PORTAL_URL is set to an approved
 * HTTPS address, e.g. https://practice.ahmedprep.com. Add other approved hosts to APPROVED_HOSTS.
 */
const APPROVED_HOSTS = [/^([a-z0-9-]+\.)*ahmedprep\.com$/i]

function approvedPortalUrl(raw: string | undefined) {
  if (!raw) return null
  try {
    const url = new URL(raw.trim())
    if (url.protocol !== "https:" || !APPROVED_HOSTS.some((host) => host.test(url.hostname))) return null
    return url.toString()
  } catch {
    return null
  }
}

export const STUDENT_PORTAL_URL = approvedPortalUrl(process.env.NEXT_PUBLIC_STUDENT_PORTAL_URL)
