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

export default async function MiniBlogPage() {
  const { blogs, jwt } = await getMiniBlogData();

  return (
    <div>
      <GeneralHeader />
      <div className="content-container mx-auto">
        {blogs.length > 0 ? (
          <MiniBlogClient initialBlogs={blogs} jwt={jwt} />
        ) : (
          <div className="p-4 border text-center">No entries found</div>
        )}
      </div>
    </div>
  );
}
