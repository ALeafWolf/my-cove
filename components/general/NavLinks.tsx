"use client";
import TransitionLink from "@/components/TransitionLink";

export default function NavLinks() {
  return (
    <nav aria-label="Main navigation" className="flex gap-4 justify-center border-y border-white p-3 w-full">
      <TransitionLink className="block text-lg hover:underline focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded" href="/post">
        Post
      </TransitionLink>
      <TransitionLink className="block text-lg hover:underline focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded" href="/mini-blog">
        Miniblog
      </TransitionLink>
    </nav>
  );
}
