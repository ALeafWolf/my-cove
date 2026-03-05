import { Suspense } from "react";
import { auth } from "@/auth";
import { get } from "@/utils/functions";
import GeneralHeader from "@/components/general/HeaderSection";
import MiniBlogClient from "@/components/mini-blog/MiniBlogClient";
import { Metadata } from "next";
import { MINI_BLOG_POPULATE, PAGE_SIZE } from "@/utils/constants";

export const metadata: Metadata = {
  title: "Miniblog | My Cove",
  description: "Short thoughts and updates",
};


async function getMiniBlogData() {
  const session = await auth();

  if (!session) {
    return { blogs: [] };
  }

  try {
    const res = await get("/mini-blogs", {
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
      params: {
        populate: MINI_BLOG_POPULATE,
        sort: ["id:desc"],
        pagination: { page: 1, pageSize: PAGE_SIZE },
      },
    });

    return {
      blogs: res.data || [],
      paginationMeta: res.meta?.pagination ?? null,
    };
  } catch (error) {
    console.error("Error fetching mini blogs:", error);
    return { blogs: [] };
  }
}

const SKELETON_HEIGHTS = [180, 280, 200, 320, 160, 240];

function MiniBlogSkeleton() {
  return (
    <div className="content-container mx-auto">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {SKELETON_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="border rounded animate-pulse bg-gray-800 mb-4 break-inside-avoid"
            style={{ height: h }}
          />
        ))}
      </div>
    </div>
  );
}

async function MiniBlogContent() {
  const { blogs, paginationMeta } = await getMiniBlogData();

  if (blogs.length === 0) {
    return (
      <div className="content-container mx-auto">
        <div className="p-4 border text-center">No entries found</div>
      </div>
    );
  }

  return (
    <div className="content-container mx-auto">
      <MiniBlogClient
        initialBlogs={blogs}
        paginationMeta={paginationMeta}
      />
    </div>
  );
}

export default function MiniBlogPage() {
  return (
    <div>
      <GeneralHeader />
      <Suspense fallback={<MiniBlogSkeleton />}>
        <MiniBlogContent />
      </Suspense>
    </div>
  );
}
