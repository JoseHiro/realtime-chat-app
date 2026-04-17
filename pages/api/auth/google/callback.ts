import type { NextApiRequest, NextApiResponse } from "next";
import { parse, serialize } from "cookie";
import { PrismaClient } from "@prisma/client";
import {
  getAppBaseUrl,
  getGoogleOAuthRedirectUri,
} from "../../../../lib/auth/appBaseUrl";
import { buildAccessTokenCookie } from "../../../../lib/auth/setAccessTokenCookie";
import {
  getGoogleClientId,
  getGoogleClientSecret,
} from "../../../../lib/auth/googleOAuthEnv";

const prisma = new PrismaClient();

function clearOAuthCookies(): string[] {
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
  return [
    serialize("g_oauth_state", "", opts),
    serialize("g_oauth_mode", "", opts),
    serialize("g_oauth_plan", "", opts),
  ];
}

type GoogleUserInfo = {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  verified_email?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const baseUrl = getAppBaseUrl(req);
  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();

  if (!clientId || !clientSecret) {
    res.setHeader("Set-Cookie", clearOAuthCookies());
    return res.redirect(
      302,
      `${baseUrl}/login?error=oauth_config&message=Server%20configuration`
    );
  }

  const { code, state, error: oauthError } = req.query;

  if (oauthError || !code || typeof code !== "string") {
    res.setHeader("Set-Cookie", clearOAuthCookies());
    return res.redirect(
      302,
      `${baseUrl}/login?error=google_cancelled&message=Sign%20in%20was%20cancelled`
    );
  }

  if (!state || typeof state !== "string") {
    res.setHeader("Set-Cookie", clearOAuthCookies());
    return res.redirect(
      302,
      `${baseUrl}/login?error=oauth_invalid&message=Invalid%20OAuth%20state`
    );
  }

  const cookies = parse(req.headers.cookie || "");

  const savedState = cookies["g_oauth_state"];
  const mode = cookies["g_oauth_mode"] === "login" ? "login" : "signup";
  const planCookie = cookies["g_oauth_plan"];

  if (!savedState || savedState !== state) {
    res.setHeader("Set-Cookie", clearOAuthCookies());
    return res.redirect(
      302,
      `${baseUrl}/login?error=oauth_state&message=Session%20expired%2C%20try%20again`
    );
  }

  const redirectUri = getGoogleOAuthRedirectUri(req);

  let tokenJson: { access_token?: string };
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    tokenJson = (await tokenRes.json()) as { access_token?: string };
    if (!tokenRes.ok || !tokenJson.access_token) {
      console.error("Google token error:", tokenJson);
      res.setHeader("Set-Cookie", clearOAuthCookies());
      return res.redirect(
        302,
        `${baseUrl}/login?error=google_token&message=Could%20not%20verify%20with%20Google`
      );
    }
  } catch (e) {
    console.error("Google token fetch:", e);
    res.setHeader("Set-Cookie", clearOAuthCookies());
    return res.redirect(
      302,
      `${baseUrl}/login?error=google_network&message=Network%20error`
    );
  }

  let profile: GoogleUserInfo;
  try {
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenJson.access_token}`,
        },
      }
    );
    profile = (await userRes.json()) as GoogleUserInfo;
    if (!userRes.ok || !profile.email || !profile.id) {
      res.setHeader("Set-Cookie", clearOAuthCookies());
      return res.redirect(
        302,
        `${baseUrl}/login?error=google_profile&message=Could%20not%20read%20Google%20profile`
      );
    }
  } catch (e) {
    console.error("Google userinfo:", e);
    res.setHeader("Set-Cookie", clearOAuthCookies());
    return res.redirect(
      302,
      `${baseUrl}/login?error=google_network&message=Network%20error`
    );
  }

  const email = profile.email.toLowerCase();
  const googleId = profile.id;
  const displayName =
    profile.name?.trim() ||
    email.split("@")[0]?.slice(0, 50) ||
    "User";

  const appendCookies = clearOAuthCookies();

  try {
    if (mode === "login") {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ googleId }, { email }],
        },
      });

      if (!user) {
        res.setHeader("Set-Cookie", appendCookies);
        return res.redirect(
          302,
          `${baseUrl}/login?error=no_account&message=No%20account%20found%2C%20please%20sign%20up%20first`
        );
      }

      if (!user.googleId) {
        res.setHeader("Set-Cookie", appendCookies);
        return res.redirect(
          302,
          `${baseUrl}/login?error=password_account&message=This%20email%20uses%20password%20login`
        );
      }

      if (user.googleId !== googleId) {
        res.setHeader("Set-Cookie", appendCookies);
        return res.redirect(
          302,
          `${baseUrl}/login?error=account_mismatch&message=Could%20not%20sign%20in`
        );
      }

      res.setHeader("Set-Cookie", [buildAccessTokenCookie(user.id), ...appendCookies]);
      return res.redirect(302, `${baseUrl}/new_chat`);
    }

    // Signup flow (plan required)
    const plan =
      planCookie === "trial" || planCookie === "pro" ? planCookie : null;
    if (!plan) {
      res.setHeader("Set-Cookie", appendCookies);
      return res.redirect(
        302,
        `${baseUrl}/signup?error=google_missing_plan&message=Choose%20a%20plan%20first`
      );
    }

    const trialEndsAt =
      plan === "trial"
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        : null;

    let user = await prisma.user.findUnique({ where: { googleId } });
    if (user) {
      res.setHeader("Set-Cookie", [
        buildAccessTokenCookie(user.id),
        ...appendCookies,
      ]);
      if (plan === "pro") {
        return res.redirect(302, `${baseUrl}/oauth-after-google?plan=pro`);
      }
      return res.redirect(302, `${baseUrl}/new_chat`);
    }

    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      if (!byEmail.googleId) {
        res.setHeader("Set-Cookie", appendCookies);
        return res.redirect(
          302,
          `${baseUrl}/signup?plan=${plan}&error=email_exists&message=Email%20already%20registered%20with%20password`
        );
      }
      user = byEmail;
      res.setHeader("Set-Cookie", [
        buildAccessTokenCookie(user.id),
        ...appendCookies,
      ]);
      if (plan === "pro") {
        return res.redirect(302, `${baseUrl}/oauth-after-google?plan=pro`);
      }
      return res.redirect(302, `${baseUrl}/new_chat`);
    }

    user = await prisma.user.create({
      data: {
        email,
        username: displayName.slice(0, 100),
        password: null,
        googleId,
        subscriptionPlan: plan,
        subscriptionStatus: plan === "trial" ? "trialing" : "pending",
        trialEndsAt,
      },
    });

    res.setHeader("Set-Cookie", [
      buildAccessTokenCookie(user.id),
      ...appendCookies,
    ]);
    if (plan === "pro") {
      return res.redirect(302, `${baseUrl}/oauth-after-google?plan=pro`);
    }
    return res.redirect(302, `${baseUrl}/new_chat`);
  } catch (e) {
    console.error("Google callback DB error:", e);
    res.setHeader("Set-Cookie", appendCookies);
    return res.redirect(
      302,
      `${baseUrl}/signup?error=server&message=Something%20went%20wrong`
    );
  }
}
