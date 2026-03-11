"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { MiniBlog } from "@/utils/types";
import { createBlog } from "@/app/actions/mini-blog";

const MODAL_TITLE_ID = "miniblog-modal-title";
const DRAFT_STORAGE_KEY_TITLE = "miniblog-draft-title";
const DRAFT_STORAGE_KEY_CONTENT = "miniblog-draft-content";

function getStoredDraft(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function clearStoredDraft() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY_TITLE);
    sessionStorage.removeItem(DRAFT_STORAGE_KEY_CONTENT);
  } catch {
    /* ignore */
  }
}

interface NewMiniBlogProps {
  setNewBlog: (show: boolean) => void;
  onBlogCreated?: (blog: MiniBlog) => void;
  initialTitle?: string;
  initialContent?: string;
  onDraftChange?: (title: string, content: string) => void;
}

export default function NewMiniBlog({
  setNewBlog,
  onBlogCreated,
  initialTitle = "",
  initialContent = "",
  onDraftChange,
}: NewMiniBlogProps) {
  const [content, setContent] = useState<string>(
    () =>
      getStoredDraft(DRAFT_STORAGE_KEY_CONTENT) ||
      initialContent
  );
  const [title, setTitle] = useState<string>(
    () =>
      getStoredDraft(DRAFT_STORAGE_KEY_TITLE) ||
      initialTitle
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const closeModal = useCallback(() => setNewBlog(false), [setNewBlog]);

  const syncDraft = useCallback(
    (t: string, c: string) => {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(DRAFT_STORAGE_KEY_TITLE, t);
          sessionStorage.setItem(DRAFT_STORAGE_KEY_CONTENT, c);
        } catch {
          /* ignore */
        }
      }
      onDraftChange?.(t, c);
    },
    [onDraftChange]
  );

  // Disable page scroll when modal is open
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content || !title) return;

    startTransition(async () => {
      setErrorMessage("");
      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);

        if (fileRef.current?.files?.length) {
          Array.from(fileRef.current.files).forEach((file) => {
            formData.append("files.media", file);
          });
        }

        const blog = await createBlog(formData);

        clearStoredDraft();
        if (onBlogCreated) {
          onBlogCreated(blog);
        }

        setNewBlog(false);
      } catch (error) {
        console.error("Error creating miniblog:", error);
        setErrorMessage(error instanceof Error ? error.message : String(error));
      }
    });
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
              onChange={(e) => {
                setTitle(e.target.value);
                syncDraft(e.target.value, content);
              }}
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
              onChange={(e) => {
                setContent(e.target.value);
                syncDraft(title, e.target.value);
              }}
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
          {errorMessage && (
            <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
