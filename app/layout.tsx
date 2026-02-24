import "@/styles/globals.scss"; // Use .scss extension
import "@/styles/tailwind.css";
import "highlight.js/styles/github-dark.css";
import type { Metadata } from "next";
import { auth } from "@/auth";
import NextAuthProvider from "@/components/SessionProvider";
import LoadingProvider from "@/components/LoadingProvider";
import NavigationEvents from "@/components/NavigationEvents";

export const metadata: Metadata = {
  title: "The ZZZ Cove",
  description: "Welcome to The ZZZ Cove",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <NextAuthProvider session={session}>
          <LoadingProvider>
            <NavigationEvents />
            {children}
          </LoadingProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
