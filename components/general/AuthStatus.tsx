"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import drive from "@/assets/images/drive.png";
import rotate from "@/assets/images/rotate.png";

export default function AuthStatus() {
  const { data: _session, status } = useSession();

  return (
    <>
      {status === "authenticated" ? (
        <div className="flex items-center flex-col gap-8">
          <div className="flex justify-center">
            <Image src={drive} alt="drive" width={300} height={300} fetchPriority="high" />
          </div>
          <button
            className="border px-4 py-2 rounded-md text-lg"
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex justify-center">
            <Image src={rotate} alt="rotate" width={300} height={300} fetchPriority="high" />
          </div>
          <div className="flex justify-center">
            <Link
              className="block text-lg border px-4 py-2 rounded-md"
              href="/login"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
