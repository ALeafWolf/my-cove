// This file allows you to override the default types for auth

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types
   */
  interface Session {
    jwt: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  /**
   * Returned by `useSession`, `getSession`, `auth`, etc
   */
  interface User {
    id: string;
    jwt: string;
  }

  // Add JWT inside next-auth module (not in next-auth/jwt)
  interface JWT {
    jwt: string;
    id: string;
  }
}
