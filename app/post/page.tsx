import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { Post } from "@/utils/types";
import GeneralHeader from "@/components/home/HeaderSection";
import { get, isoToDate, getPostThumbnailUrl } from "@/utils/functions";

async function getPosts() {
  const session = await auth();

  try {
    const res = await get("/posts", {
      headers: {
        Authorization: `Bearer ${session?.jwt}`,
      },
      params: {
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

export default async function PostsPage() {
  const posts = await getPosts();
  const postsArray = Array.isArray(posts) ? posts : [];

  return (
    <div>
      <GeneralHeader />
      <div className="content-container mx-auto">
        {postsArray.length === 0 ? (
          <div className="p-4 border rounded">No posts found</div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {postsArray.map((post: Post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="border rounded overflow-hidden transition-all hover:shadow-md flex flex-col"
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
                      className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-md"
                      aria-label={`Thumbnail for ${post.attributes.title}`}
                    ></div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2">
                    {post.attributes.title}
                  </h2>
                  <p className="text-sm">{post.attributes.summary}</p>
                  <div className="text-xs text-gray-500 mt-auto">
                    {isoToDate(post.attributes.createdAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
