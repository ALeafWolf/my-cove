import { GetServerSideProps } from "next";
import { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { useState } from "react";

import { remark } from "remark";
import html from "remark-html";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { get, isoToDate, getPostThumbnailUrl } from "@/utils/functions";
import { Post, Collection } from "@/utils/types";
import Popup from "@/components/PopupCollectionList";

interface Props {
  post: Post;
  content: string;
  headerImg: string;
  collection: Collection;
}

const Post: NextPage<Props> = ({ post, content, headerImg, collection }) => {
  const title = `${post.attributes.title} | My Cove`;
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
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      {collection && (
        <div className="flex justify-between my-6">
          <div>Before</div>
          <button onClick={() => setShowCollection(true)}>
            <FontAwesomeIcon icon={faList} size="xl"/>
          </button>
          <div>After</div>
        </div>
      )}
      {showCollection && (
        <Popup
          collection={collection}
          setPopup={setShowCollection}
          currentPostId={post.id}
        />
      )}
      <div className="flex flex-col gap-3 py-4 mt-6">
        <div>
          分类：
          {post.attributes.categories.data.map((category) => (
            <span
              className="px-2 py-1 mx-2 border rounded-md"
              key={category.id}
            >
              {category.attributes.name}
            </span>
          ))}
        </div>
        <div>
          标签：
          {post.attributes.tags.data.map((tag) => (
            <span className="px-2 py-1 mx-2 border rounded-md" key={tag.id}>
              {tag.attributes.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data } = await get(`/posts/${ctx.params?.id}`, {
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
  // defense code for no thumbnail
  let headerImg = getPostThumbnailUrl(post);
  return {
    props: {
      post,
      content,
      headerImg,
      collection,
    },
  };
};

export default Post;
