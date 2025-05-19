import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/auth";

// For Pages Router in Next.js
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Use auth as a middleware function
  return await auth(req, res);
}

// Also export the handlers directly
export { auth };
