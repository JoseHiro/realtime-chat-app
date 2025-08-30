import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { serialize } from "cookie"; // helper for cookies
import jwt from "jsonwebtoken";
import type { SignOptions, Algorithm } from "jsonwebtoken";
const prisma = new PrismaClient();

const jwtKey = "secretChatKey";
const jwtOptions: SignOptions = {
  algorithm: "HS256" as Algorithm,
  expiresIn: "7d",
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, password, email } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // Hash the user ID for storing in cookie
    const token = jwt.sign({ userId: user.id }, jwtKey, jwtOptions);

    // Set JWT in HttpOnly cookie
    res.setHeader(
      "Set-Cookie",
      serialize("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json({ userId: user.id });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
}
