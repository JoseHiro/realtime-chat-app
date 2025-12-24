// One-time script to set up admin account
// Run with: npx ts-node scripts/setup-admin.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    const email = "admin@yahoo.co.jp";
    const password = "Admin2025!";

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
          password: hashedPassword,
        },
      });

      console.log("✅ User updated to admin successfully!");
      console.log(`Email: ${updatedUser.email}`);
      console.log(`Admin: ${updatedUser.isAdmin}`);
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

      console.log("✅ Admin user created successfully!");
      console.log(`Email: ${newUser.email}`);
      console.log(`Admin: ${newUser.isAdmin}`);
    }
  } catch (error) {
    console.error("❌ Error setting up admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
