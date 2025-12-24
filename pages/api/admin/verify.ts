import { NextApiRequest, NextApiResponse } from "next";
import { verifyAdminAuth } from "../../../middleware/adminMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.admin_token;
  const decodedToken = verifyAdminAuth(token);

  if (!decodedToken) {
    return res.status(401).json({ error: "Not authenticated as admin" });
  }

  return res.status(200).json({
    isAdmin: true,
    userId: decodedToken.userId,
  });
}
