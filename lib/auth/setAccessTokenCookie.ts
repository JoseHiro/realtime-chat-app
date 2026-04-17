import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import type { SignOptions, Algorithm } from "jsonwebtoken";

const maxAgeSeconds = 60 * 60 * 24 * 7; // 7 days (aligned with email signup)

/** Serialized `Set-Cookie` value for `access_token` (append with other cookies via array). */
export function buildAccessTokenCookie(userId: string): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not set");
  }

  const options: SignOptions = {
    algorithm: "HS256" as Algorithm,
    expiresIn: maxAgeSeconds,
  };

  const token = jwt.sign({ userId }, jwtSecret, options);

  return serialize("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}
