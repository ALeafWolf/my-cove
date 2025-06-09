import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { Post } from "@/utils/types";
import GeneralHeader from "@/components/general/HeaderSection";
import {
  get,
  getPostThumbnailUrl,
  parseToSingleArray,
} from "@/utils/functions";
import moment from "moment";

interface SearchPageProps {
  searchParams: {
    category?: string | string[];
    tag?: string | string[];
  };
}

async function getFilteredPosts(searchParams: SearchPageProps["searchParams"]) {
  const session = await auth();

  if (!session) {
    return { posts: [], searchType: null, searchValue: null };
  }

  const category = parseToSingleArray(searchParams.category);
  const tag = parseToSingleArray(searchParams.tag);

  // Determine which filter to apply (prioritize category if both exist)
  const searchType = category ? "category" : tag ? "tag" : null;
  const searchValue = category ? category[0] : tag ? tag[0] : null;

  if (!searchType || !searchValue) {
    return { posts: [], searchType: null, searchValue: null };
  }

  try {
    // Build filter parameters based on search type
    const filters: any = {};
    if (searchType === "category") {
      filters.categories = {
        name: {
          $eq: searchValue,
        },
      };
    } else if (searchType === "tag") {
      filters.tags = {
        name: {
          $eq: searchValue,
        },
      };
    }

    const res = await get("/posts", {
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
      params: {
        filters,
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
  const { posts, searchType, searchValue } = await getFilteredPosts(
    searchParams
  );
  const postsArray = Array.isArray(posts) ? posts : [];

  // Create search title
  const getSearchTitle = () => {
    if (!searchType || !searchValue) return "搜索结果";
    return searchType === "category"
      ? `类别: ${searchValue}`
      : `标签: ${searchValue}`;
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
          <h1 className="text-2xl font-bold">{getSearchTitle()}</h1>
          {postsArray.length > 0 && (
            <p className="text-gray-600 mt-2">
              找到 {postsArray.length} 篇文章
            </p>
          )}
        </div>

        {postsArray.length === 0 ? (
          <div className="p-8 border border-dashed border-gray-300 text-center rounded-lg">
            <p className="text-gray-500 text-lg">未找到相关文章</p>
            {searchValue && (
              <p className="text-gray-400 mt-2">
                没有找到{searchType === "category" ? "类别" : "标签"}为 "
                {searchValue}" 的文章
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

const PostCard = ({ post }: { post: Post }) => (
  <Link
    href={`/post/${post.id}`}
    className="overflow-hidden transition-all hover:shadow-md flex flex-col bg-gray-900 rounded-md"
  >
    <div className="relative w-full h-auto aspect-3/2">
      {getPostThumbnailUrl(post) ? (
        <Image
          className="img-cover"
          src={getPostThumbnailUrl(post)}
          alt={post.attributes.title}
          width={400}
          height={300}
        />
      ) : (
        <div
          className="w-full h-full bg-linear-to-r from-blue-500 to-purple-600-md"
          aria-label={`Thumbnail for ${post.attributes.title}`}
        ></div>
      )}
    </div>
    <div className="p-4 flex-1 flex flex-col">
      <h5 className="text-lg font-semibold mb-2">{post.attributes.title}</h5>
      <p className="text-sm">{post.attributes.summary}</p>
      <div className="text-xs text-gray-500 mt-auto">
        {moment(post.attributes.createdAt).format("YYYY-MM-DD")}
      </div>
    </div>
  </Link>
);
