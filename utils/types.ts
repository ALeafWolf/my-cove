export type Post = {
  id: number;
  attributes: PostAttributes;
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
    data: {
      id: number;
      attributes: CollectionAttributes;
    };
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
  name: string;
  summary: string;
  header_image: {
    data: {
      attributes: ImageAttributes;
    };
  };
  publishedAt: string;
};
