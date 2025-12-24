import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtKey = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create admin token with admin flag
    const token = jwt.sign({ userId: user.id, isAdmin: true }, jwtKey, {
      expiresIn: "8h",
    });

    // Set admin cookie (separate from regular access_token)
    res.setHeader(
      "Set-Cookie",
      serialize("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Changed from "strict" to allow navigation
        maxAge: 60 * 60 * 8, // 8 hours
        path: "/",
      })
    );

    return res.status(200).json({
      message: "Admin login successful",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
