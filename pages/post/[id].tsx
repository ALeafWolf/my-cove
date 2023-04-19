import { GetServerSideProps } from "next";
import { NextPage } from "next";
import { get } from "@/utils/functions";
import { Post } from "@/utils/types";
import { remark } from "remark";
import html from "remark-html";
import Head from "next/head";

interface Props {
  post: Post;
  content: string;
}

const Post: NextPage<Props> = ({ post, content }) => {
  return (
    <div>
      <Head>
        <title>{post.attributes.title} | My Cove</title>
      </Head>
      <div>
        <img
          className="img-cover"
          src={post.attributes.thumbnail.data.attributes.url}
          alt={post.attributes.title}
        />
      </div>
      <h1>{post.attributes.title}</h1>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
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
          fields: "name",
        },
        tags: {
          fields: "name",
        },
      },
    },
  });
  const processedContent = await remark()
    .use(html)
    .process(data.data.attributes.content);
  const content = processedContent.toString();
  return {
    props: {
      post: data.data,
      content,
    },
  };
};

export default Post;
