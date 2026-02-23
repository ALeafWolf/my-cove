import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { cache } from "react";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  get,
  formatDate,
  getPostThumbnailUrl,
  getPrevAndNextPost,
} from "@/utils/functions";
import { Collection } from "@/utils/types";
import GeneralHeader from "@/components/general/HeaderSection";
import MarkdownContent from "@/components/general/MarkdownContent";
import CollectionList from "@/components/post/CollectionList";
import PostRedirectLink from "@/components/post/PostRedirectLink";
import type { GroupData } from "@/utils/types";

interface PostDetailProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const res = await get("/posts", { params: { fields: ["id"] } });
    return (res.data || []).map((post: { id: number }) => ({
      id: String(post.id),
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PostDetailProps) {
  const { id } = await params;
  const post = await getPost(id);

  return {
    title: `${post?.attributes.title || "Post Not Found"} | My Cove`,
    description: post?.attributes.summary || "",
  };
}

const getPost = cache(async (id: string) => {
  try {
    const res = await get(`/posts/${id}`, {
      params: {
        populate: {
          thumbnail: {
            fields: "url",
          },
          categories: {
            fields: "*",
          },
          tags: {
            fields: "name",
          },
          collection: {
            fields: "*",
            populate: {
              header_image: {
                fields: "url",
              },
              posts: {
                fields: "*",
              },
            },
          },
        },
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
});

function PostPageSkeleton() {
  return (
    <div className="content-container mx-auto">
      <div className="post-container animate-pulse">
        <div className="p-6 mb-6 flex flex-col gap-4">
          <div className="w-full aspect-[16/9] bg-gray-700 rounded" />
          <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto" />
          <div className="flex justify-around gap-4">
            <div className="h-4 bg-gray-700 rounded w-32" />
            <div className="h-4 bg-gray-700 rounded w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function PostPageContent({ params }: PostDetailProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const headerImg = getPostThumbnailUrl(post);
  const collection: Collection = post.attributes.collection?.data;

  let prevPost = null,
    nextPost = null;
  if (collection) {
    const postNavigation = getPrevAndNextPost(
      collection.attributes.posts?.data || [],
      post.id
    );
    prevPost = postNavigation.prevPost;
    nextPost = postNavigation.nextPost;
  }

  return (
    <div className="content-container mx-auto">
      <div className="post-container">
        <div className="p-6 mb-6 flex flex-col gap-4">
          {headerImg ? (
            <div className="relative w-full aspect-[16/9]">
              <Image
                className="img-cover"
                src={headerImg}
                alt={post.attributes.title}
                width={1000}
                height={1000}
                fetchPriority="high"
                loading="lazy"
              />
            </div>
          ) : null}
          <h1 className="text-center text-3xl font-bold">
            {post.attributes.title}
          </h1>
          <div className="flex justify-around text-sm text-gray-500">
            <p>
              Created:{" "}
              {formatDate(post.attributes.createdAt)}
            </p>
            <p>
              Updated:{" "}
              {formatDate(post.attributes.updatedAt)}
            </p>
          </div>
        </div>

        {collection ? (
          <div className="w-full grid md:grid-cols-3 grid-cols-1 my-6 gap-4">
            <PostRedirectLink post={prevPost} label={faArrowLeft} />
            <CollectionList collection={collection} currentPostId={post.id} />
            <PostRedirectLink post={nextPost} label={faArrowRight} />
          </div>
        ) : null}

        <MarkdownContent content={post.attributes.content} />

        <div className="flex flex-col gap-3 py-4 mt-6">
          <div className="flex gap-2 items-center post-categories">
            <div className="min-w-max">类别:</div>
            <div className="flex gap-2 flex-wrap">
              {(post.attributes.categories?.data || []).map((category: GroupData) => (
                <Link
                  href={`/search?category=${category.attributes.name}`}
                  className="block px-2 py-1 border"
                  key={category.id}
                >
                  {category.attributes.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center post-tags">
            <div className="min-w-max">标签:</div>
            <div className="flex gap-2 flex-wrap">
              {(post.attributes.tags?.data || []).map((tag: GroupData) => (
                <Link
                  href={`/search?tag=${tag.attributes.name}`}
                  className="block px-2 py-1 border"
                  key={tag.id}
                >
                  {tag.attributes.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostPage({ params }: PostDetailProps) {
  return (
    <div className="relative">
      <GeneralHeader />
      <div className="content-container mx-auto">
        <Link
          href="/post"
          className="px-4 py-2 border inline-flex gap-2 items-center mb-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
          <span>返回</span>
        </Link>
      </div>
      <Suspense fallback={<PostPageSkeleton />}>
        <PostPageContent params={params} />
      </Suspense>
    </div>
  );
}
