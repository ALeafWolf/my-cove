import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiSearch } from "@/lib/ai-search";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { query } = (body as { query?: unknown }) ?? {};

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Missing or empty query" },
      { status: 400 }
    );
  }

  if (query.length > 200) {
    return NextResponse.json(
      { error: "Query too long (max 200 characters)" },
      { status: 400 }
    );
  }

  try {
    const session = await auth();
    const trimmed = query.trim();
    const { posts, aiParsed } = await aiSearch(trimmed, session?.jwt);
    return NextResponse.json({
      posts,
      aiParsed,
      searchType: "ai",
      searchValue: trimmed,
    });
  } catch (error) {
    console.error("AI search route error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
