import { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import GeneralHeader from "@/components/home/HeaderSection";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      <Head>
        <title>My Cove</title>
      </Head>
      <GeneralHeader />
      {status === "authenticated" ? (
        <div className="flex items-center flex-col gap-8">
          <div className="flex gap-4 justify-center">
            <Link className="block text-lg" href="/post">
              Post
            </Link>
            <Link className="block text-lg" href="/miniblog">
              Miniblog
            </Link>
          </div>
          <button
            className="border px-4 py-2 rounded-md text-lg"
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Link
            className="block text-lg border px-4 py-2 rounded-md"
            href="/login"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
