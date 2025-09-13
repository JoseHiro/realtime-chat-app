import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../middleware/middleware";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token);
  if (!decodedToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    res.setHeader("Set-Cookie", "access_token=; HttpOnly; Path=/; Max-Age=0");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
