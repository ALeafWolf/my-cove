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

export type MiniBlog = {
  id: number;
  attributes: MiniBlogAttributes;
};

type MiniBlogAttributes = {
  title: string;
  content: string;
  media: {
    data: [
      {
        id: number;
        attributes: ImageAttributes;
      }
    ];
  };
  createdAt: string;
  updatedAt: string;
  user: { data: User };
};

type User = {
  id: number;
  attributes: UserAttributes;
};

type UserAttributes = {
  username: string;
  thumbnail: {
    data: {
      attributes: ImageAttributes;
    };
  };
};

export type InputType = 'text' | 'email' | 'password' | 'number' | 'textarea';