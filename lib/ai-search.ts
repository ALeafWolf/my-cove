import OpenAI from "openai";
import { get } from "@/utils/functions";
import { Post } from "@/utils/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AIParsedQuery {
  titleKeywords: string[];
  contentKeywords: string[];
  categories: string[];
  tags: string[];
  collection: string | null;
  sortField: "id" | "title" | "createdAt" | "publishedAt";
  sortOrder: "asc" | "desc";
}

const SYSTEM_PROMPT = `You are a search query parser for a personal blog/note-taking site.
Your job is to parse a natural language search query into structured filters.

The blog has posts with these fields:
- title: the post title (string)
- content: the rich text body of the post
- summary: a short text summary
- categories: taxonomy labels (many-to-many), e.g. "tech", "life", "programming"
- tags: more granular taxonomy labels (many-to-many), e.g. "react", "python", "travel"
- collection: a named series/collection the post belongs to (many-to-one)

Instructions:
- Extract keywords that should match in the title from the query
- Extract keywords that should match in content/summary
- If the query mentions specific categories, extract them
- If the query mentions specific tags, extract them
- If the query mentions a series or collection, extract the collection name
- Default sortField to "publishedAt" and sortOrder to "desc" unless the user specifies otherwise
- Use empty arrays when a filter type is not applicable`;

const AI_SEARCH_TEXT_FORMAT = {
  type: "json_schema" as const,
  name: "parsed_query",
  strict: true,
  schema: {
    type: "object" as const,
    properties: {
      titleKeywords: {
        type: "array" as const,
        items: { type: "string" as const },
        description: "Keywords to search for in the post title",
      },
      contentKeywords: {
        type: "array" as const,
        items: { type: "string" as const },
        description: "Keywords to search for in the post content or summary",
      },
      categories: {
        type: "array" as const,
        items: { type: "string" as const },
        description: "Category names to filter by",
      },
      tags: {
        type: "array" as const,
        items: { type: "string" as const },
        description: "Tag names to filter by",
      },
      collection: {
        anyOf: [{ type: "string" as const }, { type: "null" as const }],
        description: "Collection/series name to filter by, or null if not specified",
      },
      sortField: {
        type: "string" as const,
        enum: ["id", "title", "createdAt", "publishedAt"],
        description: "Field to sort results by",
      },
      sortOrder: {
        type: "string" as const,
        enum: ["asc", "desc"],
        description: "Sort direction",
      },
    },
    required: [
      "titleKeywords",
      "contentKeywords",
      "categories",
      "tags",
      "collection",
      "sortField",
      "sortOrder",
    ],
    additionalProperties: false,
  },
};

const POPULATE = {
  thumbnail: { fields: "url" },
  categories: { fields: "name" },
  tags: { fields: "name" },
  collection: {
    fields: "name",
    populate: { header_image: { fields: "url" } },
  },
};

function buildStrapiFilters(parsed: AIParsedQuery): Record<string, unknown> {
  const conditions: Record<string, unknown>[] = [];

  if (parsed.titleKeywords.length > 0) {
    const clauses = parsed.titleKeywords.map((kw) => ({
      title: { $containsi: kw },
    }));
    conditions.push(clauses.length === 1 ? clauses[0] : { $or: clauses });
  }

  if (parsed.contentKeywords.length > 0) {
    const clauses = parsed.contentKeywords.flatMap((kw) => [
      { content: { $containsi: kw } },
      { summary: { $containsi: kw } },
    ]);
    conditions.push({ $or: clauses });
  }

  if (parsed.categories.length > 0) {
    conditions.push({ categories: { name: { $in: parsed.categories } } });
  }

  if (parsed.tags.length > 0) {
    conditions.push({ tags: { name: { $in: parsed.tags } } });
  }

  if (parsed.collection) {
    conditions.push({ collection: { name: { $containsi: parsed.collection } } });
  }

  if (conditions.length === 0) return {};
  if (conditions.length === 1) return conditions[0];
  return { $and: conditions };
}

function countKeywordMatches(post: Post, keywords: string[]): number {
  const text =
    `${post.attributes.title} ${post.attributes.summary ?? ""}`.toLowerCase();
  return keywords.reduce((n, kw) => n + (text.includes(kw) ? 1 : 0), 0);
}

function rerankPosts(posts: Post[], parsed: AIParsedQuery): Post[] {
  const keywords = [
    ...parsed.titleKeywords,
    ...parsed.contentKeywords,
  ].map((k) => k.toLowerCase());

  if (keywords.length === 0) return posts;

  return [...posts].sort(
    (a, b) =>
      countKeywordMatches(b, keywords) - countKeywordMatches(a, keywords)
  );
}

export async function aiSearch(
  query: string,
  jwt?: string
): Promise<{ posts: Post[]; aiParsed: AIParsedQuery }> {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
    text: {
      format: AI_SEARCH_TEXT_FORMAT,
    },
  });

  const aiParsed: AIParsedQuery = JSON.parse(response.output_text);

  const filters = buildStrapiFilters(aiParsed);
  const sort = `${aiParsed.sortField}:${aiParsed.sortOrder}`;

  const res = await get("/posts", {
    ...(jwt && { headers: { Authorization: `Bearer ${jwt}` } }),
    params: {
      ...(Object.keys(filters).length > 0 && { filters }),
      ...(jwt && { publicationState: "preview" }),
      populate: POPULATE,
      sort: [sort],
    },
  });

  const posts: Post[] = res.data ?? [];
  return { posts: rerankPosts(posts, aiParsed), aiParsed };
}
