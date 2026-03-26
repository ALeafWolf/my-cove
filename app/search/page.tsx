import Link from "next/link";
import { Suspense } from "react";
import { Post } from "@/utils/types";
import GeneralHeader from "@/components/general/HeaderSection";
import PostCard from "@/components/post/PostCard";
import { get, parseToSingleArray } from "@/utils/functions";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import SearchForm from "@/components/search/SearchForm";
import { aiSearch, AIParsedQuery } from "@/lib/ai-search";

function AIParsedSummary({ parsed }: { parsed: AIParsedQuery }) {
  const chips: string[] = [];
  if (parsed.titleKeywords.length > 0)
    chips.push(`标题含: ${parsed.titleKeywords.join(", ")}`);
  if (parsed.contentKeywords.length > 0)
    chips.push(`内容含: ${parsed.contentKeywords.join(", ")}`);
  if (parsed.categories.length > 0)
    chips.push(`类别: ${parsed.categories.join(", ")}`);
  if (parsed.tags.length > 0)
    chips.push(`标签: ${parsed.tags.join(", ")}`);
  if (parsed.collection)
    chips.push(`合集: ${parsed.collection}`);

  if (chips.length === 0) return null;

  return (
    <div className="mt-2 mb-1 flex flex-wrap gap-1.5 text-xs">
      <span className="text-gray-400">AI 理解:</span>
      {chips.map((chip) => (
        <span
          key={chip}
          className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}


function SearchFormFallback() {
  return (
    <div
      className="flex gap-2 mb-6 h-[46px] rounded-md border border-gray-200/80 dark:border-gray-700/80 bg-transparent animate-pulse"
      aria-hidden
    />
  );
}

interface SearchPageProps {
  searchParams: Promise<{
    category?: string | string[];
    tag?: string | string[];
    q?: string | string[];
  }>;
}

async function getFilteredPosts(
  searchParams: {
    category?: string | string[];
    tag?: string | string[];
    q?: string | string[];
  },
  session: Session | null
): Promise<{
  posts: Post[];
  searchType: string | null;
  searchValue: string | null;
  aiParsed?: AIParsedQuery;
}> {
  const category = parseToSingleArray(searchParams.category);
  const tag = parseToSingleArray(searchParams.tag);
  const q = parseToSingleArray(searchParams.q);

  const searchType = category ? "category" : tag ? "tag" : q ? "q" : null;
  const searchValue = category
    ? category[0]
    : tag
    ? tag[0]
    : q
    ? q[0]
    : null;

  const isAuthenticated = !!session?.user;
  const jwt = isAuthenticated ? session!.jwt : undefined;

  try {
    if (searchType === "q" && searchValue) {
      const { posts, aiParsed } = await aiSearch(searchValue, jwt);
      return { posts, searchType, searchValue, aiParsed };
    }

    const filters: Record<string, unknown> = {};
    if (searchType === "category") {
      filters.categories = { name: { $eq: searchValue } };
    } else if (searchType === "tag") {
      filters.tags = { name: { $eq: searchValue } };
    }

    const res = await get("/posts", {
      ...(isAuthenticated && {
        headers: { Authorization: `Bearer ${jwt}` },
      }),
      params: {
        ...(Object.keys(filters).length > 0 && { filters }),
        ...(isAuthenticated && { publicationState: "preview" }),
        populate: {
          thumbnail: { fields: "url" },
          categories: { fields: "name" },
          tags: { fields: "name" },
          collection: {
            fields: "name",
            populate: { header_image: { fields: "url" } },
          },
        },
        sort: ["id:desc"],
      },
    });

    return { posts: res.data ?? [], searchType, searchValue };
  } catch (error) {
    console.error("Error fetching filtered posts:", error);
    return { posts: [], searchType, searchValue };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const [session, resolvedSearchParams] = await Promise.all([
    auth(),
    searchParams,
  ]);
  const { posts, searchType, searchValue, aiParsed } = await getFilteredPosts(
    resolvedSearchParams,
    session
  );
  const postsArray = Array.isArray(posts) ? posts : [];

  return (
    <div>
      <GeneralHeader />
      <div className="content-container mx-auto">
        <div className="mb-6">
          <Suspense fallback={<SearchFormFallback />}>
            <SearchForm />
          </Suspense>
          {aiParsed && (
            <AIParsedSummary parsed={aiParsed} />
          )}
          {postsArray.length > 0 && (
            <p className="text-gray-600 mt-2">找到 {postsArray.length} 篇文章</p>
          )}
        </div>

        {postsArray.length === 0 ? (
          <div className="p-8 border border-dashed border-gray-300 text-center rounded-lg">
            <p className="text-gray-500 text-lg">未找到相关文章</p>
            {searchValue && (
              <p className="text-gray-400 mt-2">
                没有找到
                {searchType === "category"
                  ? "类别"
                  : searchType === "tag"
                  ? "标签"
                  : "关键词"}
                为 &quot;{searchValue}&quot; 的文章
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6">
            {postsArray.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
