"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLoading } from "./LoadingProvider";

export default function NavigationEvents() {
  const pathname = usePathname();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname, setIsLoading]);

  return null;
}
