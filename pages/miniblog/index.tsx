import { NextPage } from "next";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { get, isoToDate, getPostThumbnailUrl } from "@/utils/functions";
import GeneralHeader from "@/components/GeneralHeader";
import Head from "next/head";

const MiniBlog: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Miniblog | My Cove</title>
      </Head>
        <GeneralHeader />
      <h1 className="text-center">碎碎念</h1>
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

export default MiniBlog;
