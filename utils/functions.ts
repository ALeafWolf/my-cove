import axios from "axios";
import { Post } from "./types";

const get = async (endpoint: string, params: object = {}) => {
  return await axios.get(`${process.env.API_URL}/api${endpoint}`, params);
};

const isoToDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US");
};

const getPostThumbnailUrl = (post: Post) => {
  const thumbnail = post.attributes.thumbnail.data;
  const collection = post.attributes.collection;
  let headerImg = null;
  if (thumbnail) {
    headerImg = thumbnail.attributes.url;
  } else if (collection) {
    headerImg = collection.data.attributes.header_image.data.attributes.url;
  }
  return headerImg;
}

export { get, isoToDate, getPostThumbnailUrl };
