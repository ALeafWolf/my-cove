import axios from "axios";

const get = async (endpoint: string, params: object = {}) => {
  return await axios.get(`${process.env.API_URL}/api${endpoint}`, params);
};

const isoToDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US");
};

export { get, isoToDate };
