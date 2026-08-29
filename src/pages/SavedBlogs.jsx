import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../utils/api";
import { Bookmark, Clock } from "lucide-react";

export default function SavedBlogs() {
  const { token } = useSelector((state) => state.auth);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // FIX: Old code used wrong API path (/api/bookmarks) and wrong data shape (item.blog.coverImage)
  const fetchBookmarks = async () => {
    try {
      const { data } = await API.get("/users/bookmarks");
      setBlogs(data.bookmarks || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Bookmark className="text-cyan-400" size={30} />
          <h1 className="text-4xl font-black">Saved Blogs</h1>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-24">
            <Bookmark size={60} className="mx-auto text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-400">No saved blogs yet</h2>
            <p className="text-gray-500 mt-2">Bookmark blogs to read them later</p>
            <Link to="/" className="mt-6 inline-block px-6 py-3 rounded-2xl bg-cyan-500 font-bold">
              Explore Blogs
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link to={`/blog/${blog._id}`} key={blog._id}
                className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:scale-[1.02] transition-all">
                <img
                  src={blog.image || "/header-img.png"}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <span className="text-xs text-cyan-400 font-semibold">{blog.category}</span>
                  <h2 className="text-lg font-bold mt-2 line-clamp-2">{blog.title}</h2>
                  <div className="flex items-center gap-2 mt-3 text-gray-400 text-sm">
                    <Clock size={14} /> {blog.readingTime}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}