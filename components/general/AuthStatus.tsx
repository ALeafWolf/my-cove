"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import drive from "@/assets/images/drive.png";
import rotate from "@/assets/images/rotate.png";

export default function AuthStatus() {
  const { data: _session, status } = useSession();
  const [confirmLogout, setConfirmLogout] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex justify-center" aria-live="polite" aria-busy="true">
        <div
          className="size-8 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  const handleLogout = () => {
    if (confirmLogout) {
      signOut();
      setConfirmLogout(false);
    } else {
      setConfirmLogout(true);
    }
  };

  return (
    <>
      {status === "authenticated" ? (
        <div className="flex items-center flex-col gap-8">
          <div className="flex justify-center">
            <Image src={drive} alt="drive" width={300} height={300} fetchPriority="high" />
          </div>
          <div className="flex flex-col gap-2 items-center">
            {confirmLogout && (
              <p className="text-sm" role="alert">
                确定登出？
              </p>
            )}
            <button
              type="button"
              className="border px-4 py-2 rounded-md text-lg focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              onClick={handleLogout}
            >
              {confirmLogout ? "确定登出？" : "登出"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex justify-center">
            <Image src={rotate} alt="rotate" width={300} height={300} fetchPriority="high" />
          </div>
          <div className="flex justify-center">
            <Link
              className="block text-lg border px-4 py-2 rounded-md focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              href="/login"
            >
              登录
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
