"use client";

import { useState, useRef } from "react";
import { MiniBlog } from "@/utils/types";
import { post } from "@/utils/functions";

interface NewMiniBlogProps {
  jwt?: string;
  setNewBlog: (show: boolean) => void;
  onBlogCreated?: (blog: MiniBlog) => void;
}

export default function NewMiniBlog({
  jwt,
  setNewBlog,
  onBlogCreated,
}: NewMiniBlogProps) {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content || !title) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ title, content }));

      if (fileRef.current?.files?.length) {
        Array.from(fileRef.current.files).forEach((file) => {
          formData.append("files.media", file);
        });
      }

      const response = await post("/mini-blogs", formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.data && onBlogCreated) {
        onBlogCreated(response.data.data);
      }

      setNewBlog(false);
    } catch (error) {
      console.error("Error creating miniblog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">New MiniBlog</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded p-2 h-32 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Media (optional)</label>
            <input
              type="file"
              ref={fileRef}
              className="w-full border rounded p-2 text-primary"
              multiple
              accept="image/*"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewBlog(false)}
              className="px-4 py-2 border rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
