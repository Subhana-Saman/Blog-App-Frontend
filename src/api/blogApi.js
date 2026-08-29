import API from "../utils/api";

export const getTrendingBlogs = async () => {
  const { data } = await API.get("/blogs/trending");
  return data;
};

export const searchBlogs = async (keyword, category) => {
  const { data } = await API.get(
    `/blogs/search?keyword=${keyword}&category=${category}`
  );
  return data;
};

export const likeBlog = async (blogId) => {
  const { data } = await API.put(`/blogs/like/${blogId}`, {});
  // FIX: backend returns { success, data: { likes } }
  // Previous code was reading data.likes (wrong) — correct is data.data.likes
  return { data: data.data ?? data };
};