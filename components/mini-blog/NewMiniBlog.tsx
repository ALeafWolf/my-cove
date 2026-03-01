"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import qs from "qs";
import { MiniBlog } from "@/utils/types";
import { post } from "@/utils/functions";

const MODAL_TITLE_ID = "miniblog-modal-title";

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
  const [isPending, setIsPending] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const closeModal = useCallback(() => setNewBlog(false), [setNewBlog]);

  // Disable page scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close modal when clicking on overlay (but not on the form itself)
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content || !title) return;
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title,
          content,
          user: userId,
        })
      );

      if (fileRef.current?.files?.length) {
        Array.from(fileRef.current.files).forEach((file) => {
          formData.append("files.media", file);
        });
      }

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
      setIsPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 overscroll-contain"
      style={{ overscrollBehavior: "contain" }}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={MODAL_TITLE_ID}
        className="bg-primary text-white p-4 rounded-md w-full max-w-lg mx-4 focus-visible:outline-none"
      >
        <h3 id={MODAL_TITLE_ID} className="text-xl font-bold mb-4">
          新内容
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="miniblog-title" className="block mb-1">
              标题
            </label>
            <input
              id="miniblog-title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="miniblog-content" className="block mb-1">
              正文
            </label>
            <textarea
              id="miniblog-content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded p-2 h-32 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="miniblog-files" className="block mb-1">
              图片 (optional)
            </label>
            <input
              id="miniblog-files"
              name="media"
              type="file"
              ref={fileRef}
              className="w-full border rounded p-2 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              multiple
              accept="image/*"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 border rounded-md focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              disabled={isPending}
            >
              {isPending ? "发送中…" : "发送"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
