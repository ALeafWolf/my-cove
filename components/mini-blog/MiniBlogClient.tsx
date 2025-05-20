"use client";

import { useState } from "react";
import MiniBlogBlock from "./MiniBlogBlock";
import NewMiniBlog from "./NewMiniBlog";
import { MiniBlog } from "@/utils/types";

interface MiniBlogClientProps {
  initialBlogs: MiniBlog[];
  jwt?: string;
}

export default function MiniBlogClient({
  initialBlogs,
  jwt,
}: MiniBlogClientProps) {
  const [blogs, setBlogs] = useState<MiniBlog[]>(initialBlogs);
  const [newBlog, setNewBlog] = useState<boolean>(false);

  const addNewBlog = (blog: MiniBlog) => {
    setBlogs([blog, ...blogs]);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {blogs.map((blog) => (
          <MiniBlogBlock key={blog.id} blog={blog} />
        ))}
      </div>

      <button
        onClick={() => setNewBlog(true)}
        className="fixed rounded-full p-4 bottom-4 right-4 bg-gray-500 text-white z-10 hover:cursor-pointer"
      >
        +
      </button>

      {newBlog && (
        <NewMiniBlog
          jwt={jwt}
          setNewBlog={setNewBlog}
          onBlogCreated={addNewBlog}
        />
      )}
    </>
  );
}
