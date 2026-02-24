"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import TransitionLink from "@/components/TransitionLink";
import { Post } from "@/utils/types";

interface PostRedirectLinkProps {
  post?: Post | null;
  label: string | IconDefinition;
  className?: string;
}

const PostRedirectLink = ({
  post,
  label,
  className = "",
}: PostRedirectLinkProps) => {
  if (!post) return <div></div>;

  return (
    <TransitionLink
      className={`inline-flex justify-center items-center gap-2 border p-2 ${className}`}
      href={`/post/${post.id}`}
    >
      {typeof label === "string" ? (
        <span>{label}</span>
      ) : (
        <FontAwesomeIcon icon={label} className="h-4 w-4" />
      )}
      <span>{post.attributes.title}</span>
    </TransitionLink>
  );
};

export default PostRedirectLink;
