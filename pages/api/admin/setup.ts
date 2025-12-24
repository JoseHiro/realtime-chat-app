import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// One-time setup endpoint to create/update admin user
// This should be protected or removed after initial setup
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional: Add a secret key check here for security
  // For now, allowing direct access for one-time setup
  // You should remove this endpoint or add proper security after setup

  try {
    const email = "admin@yahoo.co.jp";
    const password = "Admin1234!";

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update existing user to admin
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          isAdmin: true,
          password: hashedPassword, // Update password
        },
      });

      return res.status(200).json({
        message: "User updated to admin successfully",
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username: "Admin",
          isAdmin: true,
        },
      });

      return res.status(201).json({
        message: "Admin user created successfully",
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
    }
  } catch (error: any) {
    console.error("Admin setup error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
