import jwt from "jsonwebtoken";

const jwtKey = process.env.JWT_SECRET!;

export interface AdminJwtPayload {
  userId: string;
  isAdmin: boolean;
}

export function verifyAdminAuth(token?: string): AdminJwtPayload | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, jwtKey) as AdminJwtPayload;
    // Verify it's actually an admin token
    if (decoded.isAdmin === true) {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}
