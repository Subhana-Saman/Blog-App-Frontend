import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import API from "../utils/api";
import BlogCard from "../components/BlogCard";
import FeaturedBlogs from "../components/FeaturedBlogs";
import TrendingBlogs from "../components/TrendingBlogs";
import BlogSkeleton from "../components/BlogSkeleton";
import SEO from "../components/SEO";
import { TrendingUp, Sparkles, Search } from "lucide-react";

const CATEGORIES = ["All", "React", "JavaScript", "AI", "MERN", "Next.js"];

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/blogs");
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.blogs)
        ? data.blogs
        : Array.isArray(data.data)
        ? data.data
        : [];
      setBlogs(list);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (keyword, cat) => {
    try {
      setLoading(true);
      const { data } = await API.get(
        `/blogs/search?keyword=${keyword}&category=${cat !== "All" ? cat : ""}`
      );
      setBlogs(data.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Debounced search + category filter
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() || category !== "All") {
        handleSearch(search, category);
      } else {
        fetchBlogs();
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [search, category]);

  // BUG FIX: categoryFilteredBlogs was just = blogs (no filter applied)
  // Now category filter works client-side instantly too
  const displayBlogs =
    category === "All"
      ? blogs
      : blogs.filter(
          (b) => b.category?.toLowerCase() === category.toLowerCase()
        );

  const trendingBlogs = [...blogs]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      <SEO
        title="DevVerse — Modern Blog Platform"
        description="Advanced MERN Blog Platform"
      />

      {/* HERO */}
      <section className="relative pt-32 pb-28 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 mb-8">
              <Sparkles size={18} />
              AI Powered Blogging Platform
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 bg-clip-text text-transparent pb-2">
  Future Of <br /> Modern Blogging
</h1>

            {/* SEARCH */}
            <div className="max-w-3xl mx-auto mt-12 relative">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={22}
              />
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-5 pl-14 pr-6 rounded-3xl bg-white/5 border border-white/10 outline-none backdrop-blur-xl focus:border-cyan-400 transition-all"
              />
            </div>

            {/* CATEGORY TABS */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
  className={`px-5 py-2.5 rounded-2xl border transition-all duration-300 font-semibold text-sm whitespace-nowrap ${
    category === cat
      ? "bg-cyan-400 text-black border-cyan-400 scale-105"
      : "bg-white/5 border-white/10 hover:bg-white/10"}`}>
  {cat}
</button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <FeaturedBlogs blogs={blogs.slice(0, 5)} />
      </section>

      {/* TRENDING */}
    <section className="max-w-7xl mx-auto px-4 mt-16">
  <div className="mb-10">
    <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full mb-3" />

    <div className="flex items-center gap-3">
      <TrendingUp className="text-pink-400" size={28} />
      <h2 className="text-4xl font-black text-white">Trending Blogs</h2>
    </div>
  </div>

  <TrendingBlogs blogs={trendingBlogs} />
</section>

      {/* BLOG GRID */}
      <section className="max-w-7xl mx-auto px-4 mt-24 pb-24">
        <div className="flex justify-between items-center mb-14">
         <div>
  <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full mb-3" />

  <h2 className="text-4xl font-black">
    {category !== "All" ? `${category} Blogs` : "Latest Articles"}
  </h2>
</div>
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300">
            {displayBlogs.length} Blogs Found
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
          >
            {displayBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && displayBlogs.length === 0 && (
          <div className="text-center py-24">
            <h2 className="text-4xl font-black">No Blogs Found</h2>
            <p className="text-gray-400 mt-4 text-lg">
              Try another keyword or category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}