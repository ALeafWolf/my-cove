import Link from "next/link";
import { MiniBlog } from "@/utils/types";
import React from "react";
import { isoToDate } from "@/utils/functions";
import Image from "next/image";

interface Props {
  blog: MiniBlog;
}
const MiniBlogBlock: React.FC<Props> = ({ blog }) => {
  const user = blog?.attributes.user.data;
  const media = blog?.attributes.media.data;
  return (
    <div className="flex flex-col gap-2 border rounded-md p-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex gap-2 h-8 w-8 rounded-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${user.attributes.thumbnail.data.attributes.url})`,
            }}
          ></div>
          <h6>{user.attributes.username}</h6>
        </div>
        <p>{isoToDate(blog.attributes.createdAt)}</p>
      </div>
      <h5 className="text-xl">{blog.attributes.title}</h5>
      <p className="card-text">{blog.attributes.content}</p>
      {media?.length == 1 && (
        <div className="h-[300px]">
          <Image
            className="img-fluid"
            src={media[0].attributes.url}
            alt={blog.attributes.title}
            width={300}
            height={300}
          />
        </div>
      )}
      {media?.length > 1 && (
        <div className="grid grid-cols-3 gap-2">
          {media.map((m) => (
            <div
              key={m.id}
              className="aspect-square bg-cover bg-center"
              style={{
                backgroundImage: `url(${m.attributes.url})`,
              }}
            ></div>
          ))}
        </div>
      )}
      {/* <Link href={`/miniblog/${blog.id}`}>
        <p className="btn btn-primary">Read More →</p>
      </Link> */}
    </div>
  );
};

export default MiniBlogBlock;
