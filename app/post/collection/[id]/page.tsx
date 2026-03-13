import Image from "next/image";
import Link from "next/link";
import { Suspense, cache } from "react";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { get } from "@/utils/functions";
import { Post } from "@/utils/types";
import { auth } from "@/auth";
import GeneralHeader from "@/components/general/HeaderSection";
import PostCard from "@/components/post/PostCard";

interface CollectionDetailProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const res = await get("/post-collections", { params: { fields: ["id"] } });
    return (res.data || []).map((c: { id: number }) => ({
      id: String(c.id),
    }));
  } catch {
    return [];
  }
}

// React.cache deduplicates calls with the same (id, jwt) per request —
// generateMetadata and CollectionPageContent both call this.
const getCollection = cache(async (id: string, jwt?: string) => {
  try {
    const res = await get(`/post-collections/${id}`, {
      ...(jwt && { headers: { Authorization: `Bearer ${jwt}` } }),
      params: {
        ...(jwt && { publicationState: "preview" }),
        populate: {
          header_image: {
            fields: "url",
          },
          posts: {
            fields: ["id", "title", "summary", "createdAt"],
            populate: {
              thumbnail: {
                fields: "url",
              },
              collection: {
                populate: {
                  header_image: {
                    fields: "url",
                  },
                },
              },
            },
          },
        },
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching collection:", error);
    return null;
  }
});

export async function generateMetadata({ params }: CollectionDetailProps) {
  const { id } = await params;
  const session = await auth();
  const collection = await getCollection(id, session?.jwt);

  return {
    title: `${collection?.attributes.title || "文集"} | 眠洞`,
    description: collection?.attributes.summary || "",
  };
}

function CollectionPageSkeleton() {
  return (
    <div className="content-container mx-auto animate-pulse flex flex-col gap-6">
      <div className="w-full aspect-[16/9] bg-gray-700 rounded" />
      <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto" />
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-900 rounded-md aspect-[3/2]" />
        ))}
      </div>
    </div>
  );
}

async function CollectionPageContent({
  params,
  jwt,
}: CollectionDetailProps & { jwt?: string }) {
  const { id } = await params;
  const collection = await getCollection(id, jwt);

  if (!collection) {
    notFound();
  }

  // Defense-in-depth: middleware also blocks this, but guard here in case
  // the page is accessed via ISR cache or directly bypassing middleware.
  if (!collection.attributes.publishedAt && !jwt) {
    notFound();
  }

  const headerImg = collection.attributes.header_image?.data?.attributes?.url;
  const posts: Post[] = collection.attributes.posts?.data ?? [];

  return (
    <div className="content-container mx-auto">
      {headerImg && (
        <div className="relative w-full aspect-[16/9] mb-6 rounded overflow-hidden">
          <Image
            className="img-cover"
            src={headerImg}
            alt={collection.attributes.title}
            width={1200}
            height={675}
            priority
          />
        </div>
      )}
      <h1 className="text-3xl font-bold text-center mb-2">
        {collection.attributes.title}
      </h1>
      {collection.attributes.summary && (
        <p className="text-center text-gray-400 mb-8">
          {collection.attributes.summary}
        </p>
      )}
      {posts.length === 0 ? (
        <div className="p-4 border">No posts in this collection</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailProps) {
  const session = await auth();
  return (
    <div className="relative">
      <GeneralHeader />
      <div className="content-container mx-auto">
        <Link
          href="/post/collection"
          className="px-4 py-2 border inline-flex gap-2 items-center mb-4 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" aria-hidden />
          <span>返回</span>
        </Link>
      </div>
      <Suspense fallback={<CollectionPageSkeleton />}>
        <CollectionPageContent params={params} jwt={session?.jwt} />
      </Suspense>
    </div>
  );
}

