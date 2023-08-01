import { NextPage } from "next";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { get } from "@/utils/functions";
import GeneralHeader from "@/components/GeneralHeader";
import Head from "next/head";
import MiniBlogBlock from "@/components/MiniBlogBlock";
import { MiniBlog } from "@/utils/types";
interface Props {
  blogs: MiniBlog[];
}
const MiniBlog: NextPage<Props> = ({ blogs }) => {
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
  const res = await get("/mini-blogs", {
    headers: {
      Authorization: `Bearer ${session.jwt}`,
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
    },
  };
};

export default MiniBlog;
