import API from "../utils/api";

// FIX: Old code was using axios directly with wrong base URL
// It had /api/bookmarks which becomes /api/api/bookmarks with the baseURL

export const toggleBookmark = (blogId) =>
  API.post("/bookmarks/toggle", { blogId });

export const getBookmarks = () =>
  API.get("/bookmarks");