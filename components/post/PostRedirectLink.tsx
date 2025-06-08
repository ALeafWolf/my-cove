import Link from "next/link";
import { Post } from "@/utils/types";

interface PostRedirectLinkProps {
  post?: Post | null;
  label: string;
  className?: string;
}

const PostRedirectLink = ({
  post,
  label,
  className = "",
}: PostRedirectLinkProps) => {
  if (!post) return <></>;

  return (
    <Link
      className={`inline-flex justify-center border p-2 ${className}`}
      href={`/post/${post.id}`}
    >
      <span>{label}</span>
      <span>{post.attributes.title}</span>
    </Link>
  );
};

export default PostRedirectLink;
