// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
const jwtKey = process.env.JWT_SECRET!;

export function verifyAuth(token?: string) {
  if (!token) return null;

  try {
    return jwt.verify(token, jwtKey);
  } catch {
    return null;
  }
}
