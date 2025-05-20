import "@/styles/globals.scss"; // Use .scss extension
import "@/styles/tailwind.css";
import type { Metadata } from "next";
import NextAuthProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "The ZZZ Cove",
  description: "Welcome to The ZZZ Cove",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
