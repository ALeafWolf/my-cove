"use client";

import { useState, useRef, useEffect } from "react";
import qs from "qs";
import { MiniBlog } from "@/utils/types";
import { post } from "@/utils/functions";

interface NewMiniBlogProps {
  jwt?: string;
  userId?: number; // Add user ID prop
  setNewBlog: (show: boolean) => void;
  onBlogCreated?: (blog: MiniBlog) => void;
}

export default function NewMiniBlog({
  jwt,
  userId,
  setNewBlog,
  onBlogCreated,
}: NewMiniBlogProps) {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Disable page scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close modal when clicking on overlay (but not on the form itself)
    if (e.target === e.currentTarget) {
      setNewBlog(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content || !title) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      // Include user ID in the data
      formData.append(
        "data",
        JSON.stringify({
          title,
          content,
          user: userId, // Set the user relation
        })
      );

      if (fileRef.current?.files?.length) {
        Array.from(fileRef.current.files).forEach((file) => {
          formData.append("files.media", file);
        });
      }

      // Use populate to get user data back in response
      const populateParams = qs.stringify({
        populate: {
          user: {
            populate: ["thumbnail"],
          },
          media: true,
        },
      });

      const response = await post(`/mini-blogs?${populateParams}`, formData, {
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
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="bg-primary text-white p-4 rounded-md w-full max-w-lg mx-4">
        <h3 className="text-xl font-bold mb-4">新内容</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1">正文</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded p-2 h-32"
              required
            />
          </div>

          <div>
            <label className="block mb-1">图片 (optional)</label>
            <input
              type="file"
              ref={fileRef}
              className="w-full border rounded p-2"
              multiple
              accept="image/*"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 border rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "发送中..." : "发送"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
