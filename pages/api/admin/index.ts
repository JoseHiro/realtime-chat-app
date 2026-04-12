import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Base /api/admin route. Sub-routes live in sibling files (login, verify, etc.).
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  return res.status(200).json({ ok: true });
}
