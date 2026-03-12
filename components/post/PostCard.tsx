import Image from "next/image";
import Link from "next/link";
import { Post } from "@/utils/types";
import { formatDate, getPostThumbnailUrl } from "@/utils/functions";

const PostCard = ({ post }: { post: Post }) => {
  const thumbUrl = getPostThumbnailUrl(post);
  return (
    <Link
      href={`/post/${post.id}`}
      className="overflow-hidden transition-shadow hover:shadow-md flex flex-col bg-gray-900 rounded-md focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="relative w-full h-auto aspect-3/2">
        {thumbUrl ? (
          <Image
            className="img-cover"
            src={thumbUrl}
            alt={post.attributes.title}
            width={400}
            height={300}
          />
        ) : (
          <div
            className="w-full h-full bg-linear-to-r from-blue-500 to-purple-600"
            aria-label={`Thumbnail for ${post.attributes.title}`}
          />
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h5 className="text-lg font-semibold mb-2">{post.attributes.title}</h5>
        <p className="text-sm flex-1">{post.attributes.summary}</p>
        <div className="text-xs text-gray-500 mt-auto">
          {formatDate(post.attributes.createdAt)}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
