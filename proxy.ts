import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { isPublicPath } from "@/utils/routes";

const apiUrl = process.env.API_URL || "http://localhost:1337";

async function isDraftPost(postId: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/api/posts/${postId}?fields=publishedAt`);
    if (!res.ok) return true;
    const { data } = await res.json();
    return data?.attributes?.publishedAt === null;
  } catch {
    return true;
  }
}

async function isDraftCollection(collectionId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${apiUrl}/api/post-collections/${collectionId}?fields=publishedAt`
    );
    if (!res.ok) return true;
    const { data } = await res.json();
    return data?.attributes?.publishedAt === null;
  } catch {
    return true;
  }
}

export default auth(async (req) => {
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;

  if (!isAuthenticated && !isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  if (!isAuthenticated) {
    const postMatch = pathname.match(/^\/post\/(\d+)$/);
    if (postMatch) {
      const isDraft = await isDraftPost(postMatch[1]);
      if (isDraft) {
        return NextResponse.redirect(new URL("/not-found", req.url));
      }
    }

    const collectionMatch = pathname.match(/^\/post\/collection\/(\d+)$/);
    if (collectionMatch) {
      const isDraft = await isDraftCollection(collectionMatch[1]);
      if (isDraft) {
        return NextResponse.redirect(new URL("/not-found", req.url));
      }
    }
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico).*)"],
};
