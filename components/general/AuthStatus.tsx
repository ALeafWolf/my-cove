"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthStatus() {
  const { data: _session, status } = useSession();

  return (
    <>
      {status === "authenticated" ? (
        <div className="flex items-center flex-col gap-8">
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
