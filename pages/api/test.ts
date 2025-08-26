import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../middleware/middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("dsdsdsdsdsdsdsdsds---------------------");

  const token = req.cookies.access_token;
  console.log("token: ------", token);

  const user = verifyAuth(token);
  return user
}
