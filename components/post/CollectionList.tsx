"use client";

import { useState, useEffect, useCallback } from "react";
import TransitionLink from "@/components/TransitionLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { Collection } from "@/utils/types";

interface CollectionListProps {
  collection: Collection;
  currentPostId: number;
}

export default function CollectionList({
  collection,
  currentPostId,
}: CollectionListProps) {
  const [showList, setShowList] = useState(false);

  const closeList = useCallback(() => setShowList(false), []);

  useEffect(() => {
    if (!showList) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeList();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showList, closeList]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={showList}
        aria-haspopup="listbox"
        aria-label={`Collection: ${collection.attributes.title}`}
        className="inline-flex gap-2 border p-2 items-center justify-center bg-primary w-full hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        onClick={() => setShowList(true)}
      >
        <FontAwesomeIcon icon={faList} size="lg" color="white" />
        <span className="text-white">{collection.attributes.title}</span>
      </button>

      {showList && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={closeList}
            onKeyDown={(e) => e.key === "Escape" && closeList()}
            role="button"
            tabIndex={-1}
            aria-label="Close collection list"
          />
          <div
            role="listbox"
            aria-label="Posts in this collection"
            className="absolute top-full left-0 right-0 bg-primary z-50 p-4 border"
          >
            <div className="flex flex-col gap-2">
              {collection.attributes.posts.data.map((post) => (
                <div key={post.id} role="option" aria-selected={post.id === currentPostId}>
                  <TransitionLink
                    href={`/post/${post.id}`}
                    className={`block p-2 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
                      post.id === currentPostId ? "bg-gray-500" : ""
                    }`}
                  >
                    {post.attributes.title}
                  </TransitionLink>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
