// Strapi 5 REST response envelopes.
// The top-level { data, meta } wrapper is unchanged from v4, but per-entity
// `attributes` and per-relation `{ data }` wrappers are gone — fields and
// relations are now flattened directly onto the entity, alongside `documentId`.

export type StrapiList<T> = {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiSingle<T> = {
  data: T;
  meta: Record<string, unknown>;
};

export type StrapiImage = {
  id?: number;
  documentId?: string;
  url: string;
};

export type GroupData = {
  id: number;
  documentId: string;
  name: string;
};

export type User = {
  id: number;
  documentId: string;
  username: string;
  thumbnail: StrapiImage | null;
};

export type Post = {
  id: number;
  documentId: string;
  title: string;
  content: string;
  summary: string;
  thumbnail: StrapiImage | null;
  categories: GroupData[];
  tags: GroupData[];
  collection: Collection | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
};

export type Collection = {
  id: number;
  documentId: string;
  title: string;
  summary: string;
  header_image: StrapiImage | null;
  posts: Post[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export type MiniBlog = {
  id: number;
  documentId: string;
  title: string;
  content: string;
  media: StrapiImage[];
  createdAt: string;
  updatedAt: string;
  user: User;
};

export type InputType = "text" | "email" | "password" | "number" | "textarea";

// Type for your authenticated session
export interface AuthSession {
  jwt: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
