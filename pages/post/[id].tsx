import { GetServerSideProps } from "next";
import { NextPage } from "next";
import Image from "next/image";
import { get, isoToDate, getPostThumbnailUrl } from "@/utils/functions";
import { Post } from "@/utils/types";
import { remark } from "remark";
import html from "remark-html";
import Head from "next/head";

interface Props {
  post: Post;
  content: string;
  headerImg: string;
  collection: object;
}

const Post: NextPage<Props> = ({ post, content, headerImg, collection }) => {
  const title = `${post.attributes.title} | My Cove`
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <button className="px-4 py-2 border" onClick={() => history.back()}>
        返回
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
  // defense code for no thumbnail
  const thumbnail = post.attributes.thumbnail.data;
  const collection = post.attributes.collection.data;
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
