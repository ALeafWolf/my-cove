"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  return (
    <>
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
    </>
  );
}
