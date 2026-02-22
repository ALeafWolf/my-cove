"use client";

import { useState } from "react";
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

  return (
    <div className="relative">
      <button
        className="inline-flex gap-2 border p-2 items-center justify-center bg-primary w-full hover:cursor-pointer"
        onClick={() => setShowList(true)}
      >
        <FontAwesomeIcon icon={faList} size="lg" color="white" />
        <span className="text-white">{collection.attributes.title}</span>
      </button>

      {showList && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowList(false)}
          />
          <div className="absolute top-full left-0 right-0 bg-primary z-50 p-4 border">
            <div className="flex flex-col gap-2">
              {collection.attributes.posts.data.map((post) => (
                <div key={post.id}>
                  <TransitionLink
                    href={`/post/${post.id}`}
                    className={`block p-2 ${
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
