import { Suspense } from "react";
import { auth } from "@/auth";
import { get } from "@/utils/functions";
import GeneralHeader from "@/components/general/HeaderSection";
import MiniBlogClient from "@/components/mini-blog/MiniBlogClient";
import { Metadata } from "next";

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
        populate: {
          media: {
            fields: "url",
          },
          user: {
            fields: "username",
            populate: {
              thumbnail: {
                fields: "url",
              },
            },
          },
        },
        sort: ["id:desc"],
      },
    });

    return {
      blogs: res.data || [],
      jwt: session.jwt,
    };
  } catch (error) {
    console.error("Error fetching mini blogs:", error);
    return { blogs: [] };
  }
}

function MiniBlogSkeleton() {
  return (
    <div className="content-container mx-auto">
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border p-4 rounded animate-pulse h-40 bg-gray-800"
          />
        ))}
      </div>
    </div>
  );
}

async function MiniBlogContent() {
  const { blogs, jwt } = await getMiniBlogData();

  if (blogs.length === 0) {
    return (
      <div className="content-container mx-auto">
        <div className="p-4 border text-center">No entries found</div>
      </div>
    );
  }

  return (
    <div className="content-container mx-auto">
      <MiniBlogClient initialBlogs={blogs} jwt={jwt} />
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
