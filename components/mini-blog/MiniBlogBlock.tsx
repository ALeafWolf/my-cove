import { MiniBlog } from "@/utils/types";
import React from "react";
import { formatDate } from "@/utils/functions";
import Image from "next/image";
import Fancybox from "../Fancybox";

const FANCYBOX_OPTIONS = { Carousel: { infinite: false } };

interface Props {
  blog: MiniBlog;
  imageLoading?: "eager" | "lazy";
}
const MiniBlogBlock: React.FC<Props> = ({ blog, imageLoading }) => {
  const user = blog?.attributes.user.data;
  const media = blog?.attributes.media.data;
  return (
    <div className="flex flex-col gap-2 border p-4">
      <div className="flex justify-between">
        {user && (
          <div className="flex items-center gap-2">
            <div
              className="flex gap-2 h-8 w-8 rounded-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${user.attributes.thumbnail.data.attributes.url})`,
              }}
              role="img"
              aria-label={`Avatar of ${user.attributes.username}`}
            />
            <h6>{user.attributes.username}</h6>
          </div>
        )}
        <p>{formatDate(blog.attributes.createdAt)}</p>
      </div>
      <h5 className="text-xl">{blog.attributes.title}</h5>
      {blog.attributes.content && (
        <p className="card-text">{blog.attributes.content}</p>
      )}
      {media?.length == 1 && (
        <Fancybox
          options={FANCYBOX_OPTIONS}
          className="w-full"
        >
          <a
            data-fancybox={`gallery-${blog.id}`}
            href={media[0].attributes.url}
            className="block w-full"
          >
            <Image
              className="object-contain w-full h-full"
              src={media[0].attributes.url}
              alt={blog.attributes.title}
              width={300}
              height={300}
              loading={imageLoading ?? "lazy"}
            />
          </a>
        </Fancybox>
      )}
      {media?.length > 1 && (
        <Fancybox
          options={FANCYBOX_OPTIONS}
          className="relative"
        >
          {/* Visible first image with count overlay */}
          <a
            data-fancybox={`gallery-${blog.id}`}
            href={media[0].attributes.url}
            className="relative block"
            aria-label={`Gallery for ${blog.attributes.title}, image 1 of ${media.length}`}
          >
            <Image
              className="object-contain w-full h-auto"
              src={media[0].attributes.url}
              alt={blog.attributes.title}
              width={300}
              height={300}
              loading={imageLoading ?? "lazy"}
            />
            {/* Image count overlay */}
            <div
              className="absolute bottom-2 right-2 bg-gray-500 bg-opacity-70 text-white text-sm px-2 py-1 rounded"
              aria-hidden="true"
            >
              1/{media.length}
            </div>
          </a>

          {/* Hidden images for fancybox gallery */}
          {media.slice(1).map((m, idx) => (
            <a
              data-fancybox={`gallery-${blog.id}`}
              key={m.id}
              href={m.attributes.url}
              className="hidden"
              aria-label={`View image ${idx + 2} of ${media.length}`}
            >
              <span className="sr-only">Image {idx + 2} of {media.length}</span>
            </a>
          ))}
        </Fancybox>
      )}
    </div>
  );
};

export default MiniBlogBlock;
