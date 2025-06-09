import Link from "next/link";
import { MiniBlog } from "@/utils/types";
import React from "react";
import moment from "moment";
import Image from "next/image";
import Fancybox from "../Fancybox";

interface Props {
  blog: MiniBlog;
}
const MiniBlogBlock: React.FC<Props> = ({ blog }) => {
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
            ></div>
            <h6>{user.attributes.username}</h6>
          </div>
        )}
        <p>{moment(blog.attributes.createdAt).format("YYYY-MM-DD")}</p>
      </div>
      <h5 className="text-xl">{blog.attributes.title}</h5>
      {blog.attributes.content && (
        <p className="card-text">{blog.attributes.content}</p>
      )}
      {/* <Link href={`/miniblog/${blog.id}`}>
        <p className="btn btn-primary">Read More →</p>
      </Link> */}
      {media?.length == 1 && (
        <Fancybox
          options={{
            Carousel: {
              infinite: false,
            },
          }}
          className="w-full"
        >
          <a
            data-fancybox={`gallery-${blog.id}`}
            href={media[0].attributes.url}
            className="block w-full aspect-square"
          >
            <Image
              className="img-cover"
              src={media[0].attributes.url}
              alt={blog.attributes.title}
              width={300}
              height={300}
            />
          </a>
        </Fancybox>
      )}
      {media?.length > 1 && (
        <Fancybox
          options={{
            Carousel: {
              infinite: false,
            },
          }}
          className="relative"
        >
          {/* Visible first image with count overlay */}
          <a
            data-fancybox={`gallery-${blog.id}`}
            href={media[0].attributes.url}
            className="relative block"
          >
            <div
              className="aspect-square bg-cover bg-center"
              style={{
                backgroundImage: `url(${media[0].attributes.url})`,
              }}
            ></div>
            {/* Image count overlay */}
            <div className="absolute bottom-2 right-2 bg-gray-500 bg-opacity-70 text-white text-sm px-2 py-1 rounded">
              1/{media.length}
            </div>
          </a>

          {/* Hidden images for fancybox gallery */}
          {media.slice(1).map((m) => (
            <a
              data-fancybox={`gallery-${blog.id}`}
              key={m.id}
              href={m.attributes.url}
              className="hidden"
            ></a>
          ))}
        </Fancybox>
      )}
    </div>
  );
};

export default MiniBlogBlock;
