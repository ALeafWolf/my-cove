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
    data: {
      attributes: GroupAttributes;
    };
  };
  tags: {
    data: {
      attributes: GroupAttributes;
    };
  };
  createdAt: string;
};
type ImageAttributes = {
  url: string;
};
type GroupAttributes = {
  name: string;
};
