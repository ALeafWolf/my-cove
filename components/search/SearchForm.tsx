"use client";

import { useState, useEffect, type SubmitEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/components/LoadingProvider";

function SearchFormInner({
  qFromUrl,
  defaultValue,
}: {
  qFromUrl: string;
  defaultValue: string;
}) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const router = useRouter();
  const { setIsLoading } = useLoading();

  // Clear the loading overlay once navigation has settled (syncing external state)
  useEffect(() => {
    setIsLoading(false);
  }, [qFromUrl, setIsLoading]);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    setIsLoading(true);
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={searchTerm}
        autoFocus
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索..."
        aria-label="Search Query Input"
        className="flex-1 px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      <button
        type="submit"
        className="px-4 py-2 border rounded-md hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
        aria-label="Search"
      >
        搜索
      </button>
    </form>
  );
}

export default function SearchForm() {
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get("q") ?? "";
  // key resets SearchFormInner state on every URL change without render-phase setState
  return <SearchFormInner key={qFromUrl} qFromUrl={qFromUrl} defaultValue={qFromUrl} />;
}
