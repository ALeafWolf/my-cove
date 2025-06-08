"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<MiniBlog[]>(initialBlogs);
  const [newBlog, setNewBlog] = useState<boolean>(false);

  const addNewBlog = (blog: MiniBlog) => {
    setBlogs([blog, ...blogs]);
  };

  return (
    <>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        {blogs.map((blog) => (
          <MiniBlogBlock key={blog.id} blog={blog} />
        ))}
      </div>

      <button
        onClick={() => setNewBlog(true)}
        className="fixed w-12 h-12 rounded-full bottom-4 right-4 border bg-primary border-white text-white z-10 hover:cursor-pointer flex items-center justify-center font-bold"
      >
        +
      </button>

      {newBlog && session?.user && (
        <NewMiniBlog
          jwt={jwt}
          setNewBlog={setNewBlog}
          onBlogCreated={addNewBlog}
          userId={parseInt(session.user.id)}
        />
      )}
    </>
  );
}
