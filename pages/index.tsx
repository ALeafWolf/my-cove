import { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Post } from "@/utils/types";
import { get, isoToDate } from "@/utils/functions";
import Link from "next/link";
import Head from "next/head";
interface Props {
  posts: Post[];
}

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <div>
      <Head>
        <title>My Cove</title>
      </Head>
      <div className="flex justify-center items-center flex-col shadow-md mb-4 p-4">
        <h1>My Cove</h1>
        <p>屯放各种脑洞之地</p>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-2 gap-4 shadow-md p-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="block shadow-md hover:shadow-lg"
          >
            <div className="post-card-img-container">
              <img
                className="img-cover"
                src={post.attributes.thumbnail.data.attributes.url}
                alt={post.attributes.title}
              />
            </div>
            <div className="p-2">
              <h4>{post.attributes.title}</h4>
              <p>{post.attributes.summary}</p>
              <div>
                <p className="text-gray-500 text-right">{isoToDate(post.attributes.createdAt)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await get("/posts", {
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
      sort: ["id:desc"],
    },
  });

  return {
    props: {
      posts: res.data.data || [],
    },
  };
};

export default Home;
