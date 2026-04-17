import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { buildAccessTokenCookie } from "../../../lib/auth/setAccessTokenCookie";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, password, email, plan } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const trialEndsAt =
      plan === "trial" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null;

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        subscriptionPlan: plan,
        subscriptionStatus: plan === "trial" ? "trialing" : "pending",
        trialEndsAt,
      },
    });

    let accessCookie: string;
    try {
      accessCookie = buildAccessTokenCookie(user.id);
    } catch {
      return res.status(500).json({ error: "Server configuration error" });
    }

    res.setHeader("Set-Cookie", accessCookie);
    return res.status(201).json({ message: "successfully signed up" });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already taken" });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
}
