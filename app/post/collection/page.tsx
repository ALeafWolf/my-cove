import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/auth";
import { Collection } from "@/utils/types";
import GeneralHeader from "@/components/general/HeaderSection";
import DraftLabel from "@/components/general/DraftLabel";
import { get } from "@/utils/functions";
import type { Session } from "next-auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "文集 | 眠洞",
  description: "文章合集。",
};

export const revalidate = 3600;

async function getCollections(session: Session | null) {
  try {
    const isAuthenticated = !!session?.user;
    const res = await get("/post-collections", {
      ...(isAuthenticated && {
        headers: { Authorization: `Bearer ${session!.jwt}` },
      }),
      params: {
        ...(isAuthenticated && { publicationState: "preview" }),
        populate: {
          header_image: {
            fields: "url",
          },
          posts: {
            fields: ["id"],
          },
        },
        sort: ["id:desc"],
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

function CollectionGridSkeleton() {
  return (
    <div className="content-container mx-auto">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-md bg-gray-900 animate-pulse aspect-[3/2]"
          />
        ))}
      </div>
    </div>
  );
}

async function CollectionGrid({ session }: { session: Session | null }) {
  const collections = await getCollections(session);
  const collectionsArray = (Array.isArray(collections) ? collections : []).filter(
    (c: Collection) => (c.attributes.posts?.data?.length ?? 0) > 0
  );

  if (collectionsArray.length === 0) {
    return (
      <div className="content-container mx-auto">
        <div className="p-4 border">No collections found</div>
      </div>
    );
  }

  return (
    <div className="content-container mx-auto">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {collectionsArray.map((collection: Collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}

export default async function CollectionsPage() {
  const session = await auth();
  return (
    <div>
      <GeneralHeader />
      <Suspense fallback={<CollectionGridSkeleton />}>
        <CollectionGrid session={session} />
      </Suspense>
    </div>
  );
}

const CollectionCard = ({ collection }: { collection: Collection }) => {
  const imgUrl = collection.attributes.header_image?.data?.attributes?.url;
  const postCount = collection.attributes.posts?.data?.length ?? 0;
  const isDraft = !collection.attributes.publishedAt;

  return (
    <Link
      href={`/post/collection/${collection.id}`}
      className="overflow-hidden transition-shadow hover:shadow-md flex flex-col bg-gray-900 rounded-md focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="relative w-full h-auto aspect-3/2">
        {imgUrl ? (
          <Image
            className="img-cover"
            src={imgUrl}
            alt={collection.attributes.title}
            width={400}
            height={300}
          />
        ) : (
          <div
            className="w-full h-full bg-linear-to-r from-blue-500 to-purple-600"
            aria-label={`Thumbnail for ${collection.attributes.title}`}
          />
        )}
        {isDraft && <DraftLabel />}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h5 className="text-lg font-semibold mb-2">
          {collection.attributes.title}
        </h5>
        <p className="text-sm flex-1">{collection.attributes.summary}</p>
        <div className="text-xs text-gray-500 mt-auto">{postCount} 篇</div>
      </div>
    </Link>
  );
};
