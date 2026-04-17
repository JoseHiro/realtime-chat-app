/**
 * Prefer production names; fall back to *_LOCAL for dev .env split.
 */
export function getGoogleClientId(): string | undefined {
  return (
    process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID_LOCAL || ""
  ).trim() || undefined;
}

export function getGoogleClientSecret(): string | undefined {
  return (
    process.env.GOOGLE_CLIENT_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET_LOCAL ||
    ""
  ).trim() || undefined;
}
