"use client";
import { useSession } from "next-auth/react";
import TransitionLink from "@/components/general/TransitionLink";
import { navLinks, isPublicPath } from "@/utils/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function NavLinks() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const visibleLinks = isAuthenticated
    ? navLinks
    : navLinks.filter((link) => isPublicPath(link.href));

  if (visibleLinks.length === 0) return null;

  return (
    <nav aria-label="Main navigation" className="flex gap-4 justify-center border-y border-white p-3 w-full">
      {visibleLinks.map((link) => (
        <TransitionLink
          key={link.href}
          href={link.href}
          className="block text-lg hover:underline focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded"
        >
          {link.label}
        </TransitionLink>
      ))}
      <TransitionLink
        key="/search"
        href="/search"
        aria-label="Search"
        className="block text-lg hover:underline focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded"
      >
        <FontAwesomeIcon icon={faSearch} />
      </TransitionLink>
    </nav>
  );
}
