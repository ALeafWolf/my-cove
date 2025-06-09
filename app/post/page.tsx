import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { Post } from "@/utils/types";
import GeneralHeader from "@/components/general/HeaderSection";
import { get, getPostThumbnailUrl } from "@/utils/functions";
import moment from "moment";

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
          <div className="p-4 border">No posts found</div>
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
