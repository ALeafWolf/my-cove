export type Post = {
  id: number;
  attributes: PostAttributes;
};
export type Collection = {
  id: number;
  attributes: CollectionAttributes;
};
type PostAttributes = {
  title: string;
  content: string;
  summary: string;
  thumbnail: {
    data: {
      attributes: ImageAttributes;
    };
  };
  categories: {
    data: [
      {
        id: number;
        attributes: GroupAttributes;
      }
    ];
  };
  tags: {
    data: [
      {
        id: number;
        attributes: GroupAttributes;
      }
    ];
  };
  collection: {
    data: Collection;
  };
  createdAt: string;
  updatedAt: string;
};
type ImageAttributes = {
  url: string;
};
type GroupAttributes = {
  name: string;
};
type CollectionAttributes = {
  title: string;
  summary: string;
  header_image: {
    data: {
      attributes: ImageAttributes;
    };
  };
  publishedAt: string;
  posts: {
    data: [
      {
        id: number;
        attributes: PostAttributes;
      }
    ];
  };
};

export type AuthSesstion = {
  user: {
    email: string;
  };
  expires: string;
  id: number;
  jwt: string;
};
