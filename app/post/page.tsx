import { Suspense } from "react";
import { auth } from "@/auth";
import { Post } from "@/utils/types";
import GeneralHeader from "@/components/general/HeaderSection";
import { get } from "@/utils/functions";
import PostCard from "@/components/post/PostCard";
import type { Session } from "next-auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "思绪 | 眠洞",
  description: "思绪万千。。。",
};

export const revalidate = 3600;

async function getPosts(session: Session | null) {
  try {
    const isAuthenticated = !!session?.user;
    const res = await get("/posts", {
      ...(isAuthenticated && {
        headers: { Authorization: `Bearer ${session!.jwt}` },
      }),
      params: {
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

    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

function PostGridSkeleton() {
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

async function PostGrid({ session }: { session: Session | null }) {
  const posts = await getPosts(session);
  const postsArray = Array.isArray(posts) ? posts : [];

  if (postsArray.length === 0) {
    return (
      <div className="content-container mx-auto">
        <div className="p-4 border">No posts found</div>
      </div>
    );
  }

  return (
    <div className="content-container mx-auto">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {postsArray.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default async function PostsPage() {
  const session = await auth();
  return (
    <div>
      <GeneralHeader />
      <Suspense fallback={<PostGridSkeleton />}>
        <PostGrid session={session} />
      </Suspense>
    </div>
  );
}

