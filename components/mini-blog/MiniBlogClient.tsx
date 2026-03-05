"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { DreamMasonry } from "dream-masonry";
import MiniBlogBlock from "./MiniBlogBlock";
import { MiniBlog } from "@/utils/types";
import { loadMoreBlogs } from "@/app/actions/mini-blog";

const NewMiniBlog = dynamic(() => import("./NewMiniBlog"));

interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface MiniBlogClientProps {
  initialBlogs: MiniBlog[];
  paginationMeta?: PaginationMeta | null;
}

// Mirror DreamMasonry's column layout constants
const MAX_COLUMN_COUNT = 3;
const MIN_COLUMN_COUNT = 1;
const MIN_COLUMN_WIDTH = 300;
const GUTTER_SIZE = 16;

// Replicates DreamMasonry's calculateDimensions formula from utils.ts
function calcColumnWidth(containerWidth: number): number {
  const columnCount = Math.min(
    MAX_COLUMN_COUNT,
    Math.max(
      MIN_COLUMN_COUNT,
      Math.floor(containerWidth / (MIN_COLUMN_WIDTH + GUTTER_SIZE))
    )
  );
  return (containerWidth - (columnCount - 1) * GUTTER_SIZE) / columnCount;
}

type MasonryBlogItem = {
  id: string;
  width: number;
  height: number;
  blog: MiniBlog;
};

export default function MiniBlogClient({
  initialBlogs,
  paginationMeta,
}: MiniBlogClientProps) {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<MiniBlog[]>(initialBlogs);
  const [newBlog, setNewBlog] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(paginationMeta?.page ?? 1);
  const [pageCount, setPageCount] = useState(paginationMeta?.pageCount ?? 1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const isFetchingRef = useRef(false);
  const hasMore = currentPage < pageCount;

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [masonryItems, setMasonryItems] = useState<MasonryBlogItem[]>([]);

  // Track the container's width via ResizeObserver so we re-measure on resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  // After each render where containerWidth or blogs change, measure the hidden
  // cards at the exact column width DreamMasonry will use, then build items
  // with both width + height so DreamMasonry's positioner uses our measurements.
  // Uses useEffect (not useLayoutEffect) so we can wait for images to finish
  // loading before snapshotting heights — next/image uses `aspect-ratio: auto`
  // which reflows to the natural image dimensions only after load.
  useEffect(() => {
    if (containerWidth === 0 || !measureRef.current || blogs.length === 0)
      return;

    const columnWidth = calcColumnWidth(containerWidth);

    const doMeasure = () => {
      if (!measureRef.current) return;
      const children = measureRef.current.children;
      const items: MasonryBlogItem[] = blogs.map((blog, i) => {
        const el = children[i] as HTMLElement | undefined;
        const height = el
          ? Math.round(el.getBoundingClientRect().height)
          : columnWidth;
        return { id: String(blog.id), width: columnWidth, height, blog };
      });
      setMasonryItems(items);
    };

    const imgs = Array.from(
      measureRef.current.querySelectorAll<HTMLImageElement>("img")
    );
    const pending = imgs.filter((img) => !img.complete);

    if (pending.length === 0) {
      doMeasure();
      return;
    }

    let remaining = pending.length;
    const onSettle = () => {
      if (--remaining === 0) doMeasure();
    };
    pending.forEach((img) => {
      img.addEventListener("load", onSettle);
      img.addEventListener("error", onSettle);
    });
    return () => {
      pending.forEach((img) => {
        img.removeEventListener("load", onSettle);
        img.removeEventListener("error", onSettle);
      });
    };
  }, [containerWidth, blogs]);

  const columnWidth = containerWidth > 0 ? calcColumnWidth(containerWidth) : 0;

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setIsFetchingMore(true);
    try {
      const res = await loadMoreBlogs(currentPage + 1);
      const newBlogs: MiniBlog[] = res.data || [];
      setBlogs((prev) => [...prev, ...newBlogs]);
      setCurrentPage(res.meta?.pagination?.page ?? currentPage + 1);
      setPageCount(res.meta?.pagination?.pageCount ?? pageCount);
    } catch (err) {
      console.error("Error loading more mini blogs:", err);
    } finally {
      isFetchingRef.current = false;
      setIsFetchingMore(false);
    }
  }, [hasMore, currentPage, pageCount]);

  const addNewBlog = useCallback((blog: MiniBlog) => {
    setBlogs((prev) => [blog, ...prev]);
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ position: "relative" }}>
        {/*
          Hidden measurement layer: cards rendered at the exact column width
          DreamMasonry will use, so getBoundingClientRect().height returns the
          true rendered height before DreamMasonry positions anything.
        */}
        <div
          ref={measureRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: columnWidth > 0 ? columnWidth : "100%",
            height: 0,
            overflow: "hidden",
            visibility: "hidden",
            pointerEvents: "none",
          }}
        >
          {blogs.map((blog) => (
            <div key={blog.id}>
              <MiniBlogBlock blog={blog} imageLoading="eager" />
            </div>
          ))}
        </div>

        {masonryItems.length > 0 && (
          <DreamMasonry
            items={masonryItems}
            maxColumnCount={MAX_COLUMN_COUNT}
            minColumnCount={MIN_COLUMN_COUNT}
            minColumnWidth={MIN_COLUMN_WIDTH}
            gutterSize={GUTTER_SIZE}
            renderItem={(item) => <MiniBlogBlock blog={item.blog} />}
            hasMore={hasMore}
            isFetchingMore={isFetchingMore}
            onLoadMore={loadMore}
            scrollThreshold={2000}
            renderLoader={() => (
              <div className="flex justify-center items-center gap-2 py-8">
                <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce" />
              </div>
            )}
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => setNewBlog(true)}
        aria-label="Create new mini-blog"
        className="fixed w-12 h-12 rounded-full bottom-4 right-4 border bg-primary border-white text-white z-10 hover:cursor-pointer flex items-center justify-center font-bold focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        +
      </button>

      {newBlog && session?.user && (
        <NewMiniBlog
          setNewBlog={setNewBlog}
          onBlogCreated={addNewBlog}
        />
      )}
    </>
  );
}
