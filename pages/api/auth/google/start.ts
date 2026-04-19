import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";
import { serialize } from "cookie";
import { getGoogleOAuthRedirectUri } from "../../../../lib/auth/appBaseUrl";
import { getGoogleClientId } from "../../../../lib/auth/googleOAuthEnv";

const COOKIE_MAX_AGE = 60 * 10; // 10 minutes

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = getGoogleClientId();
  const mode =
    req.query.mode === "login" ? "login" : ("signup" as "login" | "signup");
  const planParam = req.query.plan;

  if (!clientId) {
    const msg = encodeURIComponent(
      "Google sign-in is not configured. Add GOOGLE_CLIENT_ID or GOOGLE_CLIENT_ID_LOCAL (and matching SECRET) to .env and restart the dev server."
    );
    if (mode === "login") {
      return res.redirect(302, `/login?error=oauth_config&message=${msg}`);
    }
    const planQ =
      planParam === "trial" || planParam === "pro" ? `&plan=${planParam}` : "";
    return res.redirect(
      302,
      `/signup?error=oauth_config&message=${msg}${planQ}`
    );
  }

  if (mode === "signup") {
    if (planParam !== "trial" && planParam !== "pro") {
      return res.redirect(
        "/signup?error=google_missing_plan&message=Choose%20a%20plan%20first"
      );
    }
  }

  const state = randomBytes(32).toString("hex");
  const redirectUri = getGoogleOAuthRedirectUri(req);

  const cookies: string[] = [
    serialize("g_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    }),
    serialize("g_oauth_mode", mode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    }),
  ];

  if (mode === "signup" && (planParam === "trial" || planParam === "pro")) {
    cookies.push(
      serialize("g_oauth_plan", planParam, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      })
    );
  }

  res.setHeader("Set-Cookie", cookies);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return res.redirect(302, url);
}
