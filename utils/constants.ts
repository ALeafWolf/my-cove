/* mini-blog constants */
export const PAGE_SIZE = 25;

export const MINI_BLOG_POPULATE = {
  media: {
    fields: "url",
  },
  user: {
    fields: "username",
    populate: {
      thumbnail: {
        fields: "url",
      },
    },
  },
};
