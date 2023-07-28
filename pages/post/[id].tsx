import { GetServerSideProps } from "next";
import { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { useState } from "react";
import { getSession } from "next-auth/react";

import { remark } from "remark";
import html from "remark-html";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import {
  get,
  isoToDate,
  getPostThumbnailUrl,
  getPrevAndNextPost,
} from "@/utils/functions";
import { Post, Collection } from "@/utils/types";
import Popup from "@/components/PopupCollectionList";

interface Props {
  post: Post;
  prevPost: Post;
  nextPost: Post;
  content: string;
  headerImg: string;
  collection: Collection;
}

const Post: NextPage<Props> = ({
  post,
  prevPost,
  nextPost,
  content,
  headerImg,
  collection,
}) => {
  const title = `${post.attributes.title || "404"} | My Cove`;
  const [showCollection, setShowCollection] = useState(false);

  return (
    <div className="relative">
      <Head>
        <title>{title}</title>
      </Head>
      <button className="px-4 py-2 border" onClick={() => history.back()}>
        <span>
          <FontAwesomeIcon icon={faArrowLeft} />
          返回
        </span>
      </button>
      {post && (
        <div>
          <div className="p-6 mb-6">
            {headerImg && (
              <Image
                className="img-cover"
                src={headerImg}
                alt={post.attributes.title}
                width={800}
                height={500}
              />
            )}
            <h1 className="text-center">{post.attributes.title}</h1>
            <div className="flex justify-around">
              <p className="text-gray-100 text-right">
                创建：{isoToDate(post.attributes.createdAt)}
              </p>
              <p className="text-gray-100 text-right">
                更新：{isoToDate(post.attributes.updatedAt)}
              </p>
            </div>
          </div>
          {collection && (
            <div className="w-full grid md:grid-cols-3 grid-cols-1 my-6 gap-4">
              {prevPost ? (
                <a
                  className="inline-flex justify-center border rounded-md p-2"
                  href={`/post/${prevPost.id}`}
                >
                  <span>上一篇：</span>
                  <span>{prevPost.attributes.title}</span>
                </a>
              ) : (
                <div className="text-center p-2">到头了！=￣ω￣=</div>
              )}

              <button
                className="inline-flex gap-2 border rounded-md p-2 items-center justify-center bg-white"
                onClick={() => setShowCollection(true)}
              >
                <FontAwesomeIcon icon={faList} size="lg" color="#2b2a37" />
                <span className="text-[#2b2a37]">
                  {collection.attributes.title}
                </span>
              </button>
              {nextPost ? (
                <a
                  className="inline-flex justify-center border rounded-md p-2"
                  href={`/post/${nextPost.id}`}
                >
                  <span>下一篇：</span>
                  <span>{nextPost.attributes.title}</span>
                </a>
              ) : (
                <div className="text-center p-2">没有了~┑(￣Д ￣)┍</div>
              )}
            </div>
          )}
          {showCollection && (
            <div>
              <Popup
                collection={collection}
                setPopup={setShowCollection}
                currentPostId={post.id}
              />
              <div
                className="popup-mask"
                onClick={() => setShowCollection(false)}
              ></div>
            </div>
          )}
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      )}

      <div className="flex flex-col gap-3 py-4 mt-6">
        <div className="flex gap-2">
          <div className="min-w-max">分类：</div>
          <div className="flex gap-2 flex-wrap">
            {post.attributes.categories.data.map((category) => (
              <a
                href={`/search?category=${category.attributes.name}`}
                className="block px-2 py-1 border rounded-md"
                key={category.id}
              >
                {category.attributes.name}
              </a>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="min-w-max">标签：</div>
          <div className="flex gap-2 flex-wrap">
            {post.attributes.tags.data.map((tag) => (
              <a
                href={`/search?tag=${tag.attributes.name}`}
                className="block px-2 py-1 border rounded-md"
                key={tag.id}
              >
                {tag.attributes.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  // Check if session exists or not, if not, redirect
  if (session == null) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  const { data } = await get(`/posts/${ctx.params?.id}`, {
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
  const processedContent = await remark()
    .use(html)
    .process(data.data.attributes.content);
  const content = processedContent.toString();
  const post = data.data;
  const collection: Collection = post.attributes.collection.data;
  let prev = null,
    next = null;
  if (collection) {
    const { prevPost, nextPost } = getPrevAndNextPost(
      collection.attributes.posts.data,
      post.id
    );
    prev = prevPost;
    next = nextPost;
  }
  // defense code for no thumbnail
  let headerImg = getPostThumbnailUrl(post);
  return {
    props: {
      post,
      prevPost: prev,
      nextPost: next,
      content,
      headerImg,
      collection,
    },
  };
};

export default Post;
