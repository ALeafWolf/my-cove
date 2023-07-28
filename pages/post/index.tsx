import { NextPage } from "next";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { Post, AuthSesstion } from "@/utils/types";
import { get, isoToDate, getPostThumbnailUrl } from "@/utils/functions";
import Link from "next/link";
import { getSession } from "next-auth/react";
import GeneralHeader from "@/components/GeneralHeader";
import Head from "next/head";

interface Props {
  posts: Post[];
}

const Post: NextPage<Props> = ({ posts }) => {
  return (
    <div>
      <Head>
        <title>Posts | My Cove</title>
      </Head>
      <GeneralHeader />
      <h1 className="text-center">完整的碎碎念</h1>
      <div className="grid md:grid-cols-3 grid-cols-2 gap-4 p-4">
        {posts ? (
          posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="block">
              <div className="post-card-img-container">
                {getPostThumbnailUrl(post) && (
                  <Image
                    className="img-cover"
                    src={getPostThumbnailUrl(post) || ""}
                    alt={post.attributes.title}
                    width={400}
                    height={300}
                  />
                )}
              </div>
              <div className="p-2">
                <h4>{post.attributes.title}</h4>
                <p>{post.attributes.summary}</p>
                <div>
                  <p className="text-gray-500 text-right">
                    {isoToDate(post.attributes.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div>qaq</div>
        )}
      </div>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  // Check if session exists or not, if not, redirect
  if (session == null) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  const res = await get("/posts", {
    headers: {
      Authorization: `Bearer ${session.jwt}`,
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

  return {
    props: {
      posts: res.data.data || [],
    },
  };
};

export default Post;
