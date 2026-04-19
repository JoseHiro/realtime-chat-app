import type { NextApiRequest } from "next";

/**
 * Public origin for links and redirects. Prefer explicit env in production.
 */
export function getAppBaseUrl(req: NextApiRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const host = req.headers.host || "";

  // Local dev: derive from the browser Host (ignore VERCEL_URL / bad x-forwarded-proto)
  if (
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]")
  ) {
    return `http://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  const proto = req.headers["x-forwarded-proto"] ?? "http";
  if (host && typeof proto === "string") {
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

/**
 * Must match **exactly** one "Authorized redirect URI" in Google Cloud for this client.
 * Set GOOGLE_REDIRECT_URI in .env to paste the same string as in the console (recommended).
 *
 * When you open the app on localhost but NEXT_PUBLIC_APP_URL points at production,
 * we still use the browser host for the OAuth callback so it matches a local redirect URI.
 */
export function getGoogleOAuthRedirectUri(req: NextApiRequest): string {
  const explicit = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const host = req.headers.host || "";
  if (
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]")
  ) {
    return `http://${host}/api/auth/google/callback`;
  }

  return `${getAppBaseUrl(req)}/api/auth/google/callback`;
}
