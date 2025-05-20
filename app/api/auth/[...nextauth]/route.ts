import NextAuth from "next-auth";
import { handlers } from "@/auth";

// Export the Next.js API route handler
export const { GET, POST } = handlers;
