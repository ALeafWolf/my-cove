"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLoading } from "../LoadingProvider";

type TransitionLinkProps = ComponentProps<typeof Link>;

export default function TransitionLink({
  href,
  onClick,
  children,
  ...rest
}: TransitionLinkProps) {
  const { setIsLoading } = useLoading();

  return (
    <Link
      href={href}
      onClick={(e) => {
        setIsLoading(true);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
