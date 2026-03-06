"use server";

import { auth } from "@/auth";
import { get } from "@/utils/functions";
import { MINI_BLOG_POPULATE, PAGE_SIZE } from "@/utils/constants";
import { MiniBlog } from "@/utils/types";
import qs from "qs";

const apiUrl = process.env.API_URL || "https://cms.thezzzcove.com";

export async function loadMoreBlogs(page: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return get("/mini-blogs", {
    headers: { Authorization: `Bearer ${session.jwt}` },
    params: {
      populate: MINI_BLOG_POPULATE,
      sort: ["id:desc"],
      pagination: { page, pageSize: PAGE_SIZE },
    },
  });
}

export async function createBlog(formData: FormData): Promise<MiniBlog> {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const userId = parseInt(session.user?.id ?? "0");

  const payload = new FormData();
  payload.append("data", JSON.stringify({ title, content, user: userId }));

  const files = formData.getAll("files.media");
  files.forEach((file) => payload.append("files.media", file as Blob));

  const populateParams = qs.stringify({
    populate: {
      user: { populate: ["thumbnail"] },
      media: true,
    },
  });

  const response = await fetch(
    `${apiUrl}/api/mini-blogs?${populateParams}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
      body: payload,
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}
