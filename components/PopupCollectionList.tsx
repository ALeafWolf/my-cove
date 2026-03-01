"use client";

import { Collection, Post } from "@/utils/types";
import { FunctionComponent, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface Props {
  collection: Collection;
  setPopup: (bool: boolean) => void;
  currentPostId: number;
}

const Popup: FunctionComponent<Props> = ({
  collection,
  setPopup,
  currentPostId,
}) => {
  const closePopup = useCallback(() => setPopup(false), [setPopup]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePopup]);

  return (
    <div
      className="collection-popup p-4 pt-10 relative"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-collection-title"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute right-4 top-2 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded"
        onClick={closePopup}
      >
        <FontAwesomeIcon icon={faXmark} size="xl" aria-hidden />
      </button>
      <Image
        className="w-full"
        src={collection.attributes.header_image.data.attributes.url}
        alt={collection.attributes.title}
        width={400}
        height={250}
      />
      <h3 id="popup-collection-title" className="text-center">
        {collection.attributes.title}
      </h3>
      <ol>
        {collection.attributes.posts.data.map((post: Post) => (
          <li key={post.id} className={post.id === currentPostId ? "text-green-500 font-semibold" : ""}>
            {post.id === currentPostId ? (
              <p>{post.attributes.title}</p>
            ) : (
              <Link
                href={`/post/${post.id}`}
                className="focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded"
              >
                {post.attributes.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Popup;
