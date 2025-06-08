"use client";
import Link from "next/link";

export default function NavLinks() {
  return (
    <div className="flex gap-4 justify-center border-y border-white p-3 w-full">
      <Link className="block text-lg hover:underline" href="/post">
        Post
      </Link>
      <Link className="block text-lg hover:underline" href="/mini-blog">
        Miniblog
      </Link>
    </div>
  );
}
