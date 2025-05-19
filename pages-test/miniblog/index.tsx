import { NextPage } from "next";
import { useState } from "react";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { get } from "@/utils/functions";
import GeneralHeader from "@/components/home/HeaderSection";
import Head from "next/head";
import MiniBlogBlock from "@/components/MiniBlogBlock";
import { MiniBlog } from "@/utils/types";
import NewMiniBlog from "@/components/NewMiniBlog";
interface Props {
  blogs: MiniBlog[];
  jwt?: string;
}
const MiniBlog: NextPage<Props> = ({ blogs, jwt }) => {
  const [newBlog, setNewBlog] = useState<boolean>(false);

  return (
    <div>
      <Head>
        <title>Miniblog | My Cove</title>
      </Head>
      <GeneralHeader />
      <h1 className="text-center">碎碎念</h1>
      {blogs ? (
        <div className="flex flex-col gap-4">
          {blogs.map((blog) => (
            <MiniBlogBlock key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div>qaq</div>
      )}
      <button
        onClick={() => setNewBlog(true)}
        className="fixed rounded-full p-4 bottom-4 right-4 bg-slate-500 z-10"
      >
        +
      </button>
      {newBlog && <NewMiniBlog jwt={jwt} setNewBlog={setNewBlog} />}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: Session | null = await getSession(context);
  // Check if session exists or not, if not, redirect
  if (session == null) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  const jwt = session.jwt;
  const res = await get("/mini-blogs", {
    headers: {
      Authorization: `Bearer ${jwt}`,
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
    props: {
      blogs: res.data.data || [],
      jwt,
    },
  };
};

export default MiniBlog;
