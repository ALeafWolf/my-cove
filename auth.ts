import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

/**
 * Extend the built-in session types
 */
declare module "next-auth" {
  interface Session {
    jwt: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  // JWT interface inside next-auth module
  interface JWT {
    jwt: string;
    id: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Use axios instead of fetch for better error handling
          const apiUrl = process.env.API_URL || "https://cms.thezzzcove.com";
          const response = await axios.post(`${apiUrl}/api/auth/local`, {
            identifier: credentials?.email,
            password: credentials?.password,
          });

          const data = response.data;

          if (data.jwt) {
            return {
              id: data.user.id,
              name: data.user.username,
              email: data.user.email,
              jwt: data.jwt,
            };
          }
          return null;
        } catch (error) {
          console.error(
            "Auth error:",
            (error as any).response?.data || (error as Error).message
          );
          return null;
        }
      },
    }),
  ],
  pages: {
    // Specify custom error and sign in pages
    signIn: "/login",
    error: "/login",
  },
  // Use JWT strategy since you're storing JWT token
  session: {
    strategy: "jwt",
    // Match your current session duration
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // Forward the JWT to the session so it's available in session.jwt
    async session({ session, token }) {
      if (token?.jwt) {
        session.jwt = token.jwt as string;
      }
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // Custom JWT handling to preserve your current JWT
    async jwt({ token, user }) {
      if (user) {
        token.jwt = user.jwt as string;
        token.id = user.id as string;
      }
      return token;
    },
  },
  // Add debug mode to see more detailed errors
  debug: process.env.NODE_ENV === "development",
});
