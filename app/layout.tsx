import "@/styles/globals.scss"; // Use .scss extension
import "@/styles/tailwind.css";
import "highlight.js/styles/github-dark.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { auth } from "@/auth";
import NextAuthProvider from "@/components/SessionProvider";
import LoadingProvider from "@/components/LoadingProvider";
import NavigationEvents from "@/components/NavigationEvents";

const GA_ID = process.env.PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: "The ZZZ Cove",
  description: "Welcome to The ZZZ Cove",
};

export const viewport: Viewport = {
  themeColor: "#2b2a37",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:p-4 focus:bg-primary focus:text-white focus:border focus:border-white focus:m-0 focus:w-auto focus:h-auto focus:overflow-visible focus:not-sr-only"
        >
          Skip to content
        </a>
        <NextAuthProvider session={session}>
          <LoadingProvider>
            <NavigationEvents />
            <main id="main-content">{children}</main>
          </LoadingProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
