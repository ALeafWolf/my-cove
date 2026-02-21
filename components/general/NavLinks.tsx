"use client";
import TransitionLink from "@/components/TransitionLink";

export default function NavLinks() {
  return (
    <div className="flex gap-4 justify-center border-y border-white p-3 w-full">
      <TransitionLink className="block text-lg hover:underline" href="/post">
        Post
      </TransitionLink>
      <TransitionLink className="block text-lg hover:underline" href="/mini-blog">
        Miniblog
      </TransitionLink>
    </div>
  );
}
