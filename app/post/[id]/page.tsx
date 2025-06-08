import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { remark } from "remark";
import html from "remark-html";

import {
  get,
  isoToDate,
  getPostThumbnailUrl,
  getPrevAndNextPost,
} from "@/utils/functions";
import { Post, Collection } from "@/utils/types";
import GeneralHeader from "@/components/general/HeaderSection";
import CollectionList from "@/components/post/CollectionList";
import PostRedirectLink from "@/components/post/PostRedirectLink";
import type { GroupData } from "@/utils/types";

interface PostDetailProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PostDetailProps) {
  const post = await getPost(params.id);

  return {
    title: `${post?.attributes.title || "Post Not Found"} | My Cove`,
    description: post?.attributes.summary || "",
  };
}

async function getPost(id: string) {
  const session = await auth();

  if (!session) {
    return null;
  }

  try {
    const res = await get(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
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
}

async function processContent(content: string) {
  const processedContent = await remark().use(html).process(content);
  return processedContent.toString();
}

export default async function PostPage({ params }: PostDetailProps) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  const content = await processContent(post.attributes.content);
  const headerImg = getPostThumbnailUrl(post);
  const collection: Collection = post.attributes.collection.data;

  let prevPost = null,
    nextPost = null;
  if (collection) {
    const postNavigation = getPrevAndNextPost(
      collection.attributes.posts.data,
      post.id
    );
    prevPost = postNavigation.prevPost;
    nextPost = postNavigation.nextPost;
  }

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

        <div className="post-container">
          <div className="p-6 mb-6 flex flex-col gap-4">
            {headerImg && (
              <div className="relative w-full aspect-[16/9]">
                <Image
                  className="img-cover"
                  src={headerImg}
                  alt={post.attributes.title}
                  width={1000}
                  height={1000}
                />
              </div>
            )}
            <h1 className="text-center text-3xl font-bold">
              {post.attributes.title}
            </h1>
            <div className="flex justify-around text-sm text-gray-500">
              <p>Created: {isoToDate(post.attributes.createdAt)}</p>
              <p>Updated: {isoToDate(post.attributes.updatedAt)}</p>
            </div>
          </div>

          {collection && (
            <div className="w-full grid md:grid-cols-3 grid-cols-1 my-6 gap-4">
              <PostRedirectLink post={prevPost} label="上一篇：" />
              <CollectionList collection={collection} currentPostId={post.id} />
              <PostRedirectLink post={nextPost} label="下一篇：" />
            </div>
          )}

          <div
            className="post-content overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>

        <div className="flex flex-col gap-3 py-4 mt-6">
          <div className="flex gap-2">
            <div className="min-w-max">Categories:</div>
            <div className="flex gap-2 flex-wrap">
              {post.attributes.categories.data.map((category: GroupData) => (
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
          <div className="flex gap-2">
            <div className="min-w-max">Tags:</div>
            <div className="flex gap-2 flex-wrap">
              {post.attributes.tags.data.map((tag: GroupData) => (
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
