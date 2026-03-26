import Link from "next/link";
import { Suspense } from "react";
import { Post } from "@/utils/types";
import GeneralHeader from "@/components/general/HeaderSection";
import PostCard from "@/components/post/PostCard";
import { get, parseToSingleArray } from "@/utils/functions";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import SearchForm from "@/components/search/SearchForm";

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
) {
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

  try {
    const filters: any = {};
    if (searchType === "category") {
      filters.categories = { name: { $eq: searchValue } };
    } else if (searchType === "tag") {
      filters.tags = { name: { $eq: searchValue } };
    } else if (searchType === "q") {
      filters.title = { $containsi: searchValue };
    }

    const res = await get("/posts", {
      ...(isAuthenticated && {
        headers: { Authorization: `Bearer ${session!.jwt}` },
      }),
      params: {
        ...(Object.keys(filters).length > 0 && { filters }),
        ...(isAuthenticated && { publicationState: "preview" }),
        populate: {
          thumbnail: {
            fields: "url",
          },
          categories: {
            fields: "name",
          },
          tags: {
            fields: "name",
          },
          collection: {
            fields: "name",
            populate: {
              header_image: {
                fields: "url",
              },
            },
          },
        },
        sort: ["id:desc"],
      },
    });

    return {
      posts: res.data || [],
      searchType,
      searchValue,
    };
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
  const { posts, searchType, searchValue } = await getFilteredPosts(
    resolvedSearchParams,
    session
  );
  const postsArray = Array.isArray(posts) ? posts : [];

  const getSearchTitle = () => {
    if (!searchType || !searchValue) return "所有文章";
    if (searchType === "category") return `类别: ${searchValue}`;
    if (searchType === "tag") return `标签: ${searchValue}`;
    return `搜索: ${searchValue}`;
  };

  return (
    <div>
      <GeneralHeader />
      <div className="content-container mx-auto">
        <div className="mb-6">
          <Link
            href="/post"
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-md mb-4 hover:bg-gray-50"
          >
            ← 返回所有文章
          </Link>

          <Suspense fallback={<SearchFormFallback />}>
            <SearchForm />
          </Suspense>

          <h1 className="text-2xl font-bold">{getSearchTitle()}</h1>
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
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {postsArray.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
