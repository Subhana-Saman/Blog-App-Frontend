import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { likeBlog } from "../api/blogApi";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function BlogCard({ blog }) {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [likes, setLikes] = useState(blog?.likes?.length || 0);
  const [liked, setLiked] = useState(blog?.likes?.includes(user?._id));

 const handleLike = async () => {
  if (!token) return toast.error("Login required");
  try {
    const { data } = await likeBlog(blog._id);
    // data.likes aata hai from blogApi fix above
    setLikes(typeof data.likes === "number" ? data.likes : likes + (liked ? -1 : 1));
    setLiked(!liked);
  } catch (err) {
    if (err?.response?.status === 401) toast.error("Login required");
    else toast.error("Like failed");
  }
};

  const handleDelete = async () => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await API.delete(`/blogs/${blog._id}`);
      toast.success("Blog deleted");
      window.location.reload();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col h-full hover:border-cyan-500/20 transition-all">

      {/* IMAGE */}
      <Link to={`/blog/${blog._id}`}>
     <img
        src={blog.image?.trim() ? blog.image : "/header-img.png"}
        alt={blog.title}
        onError={(e) => { e.target.onerror = null; e.target.src = "/header-img.png"; }}
        className="h-52 w-full object-cover hover:scale-105 transition-transform duration-500"
           />
      </Link>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1">

        {/* CATEGORY + READ TIME */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold">
            {blog.category || "General"}
          </span>
          <span className="text-xs text-white/50">{blog.readingTime || "1 min read"}</span>
        </div>

        {/* TITLE */}
        <Link to={`/blog/${blog._id}`}>
          <h2 className="text-xl font-black mb-2 line-clamp-2 hover:text-cyan-400 transition-colors">
            {blog.title}
          </h2>
        </Link>

        {/* EXCERPT */}
        <p className="text-gray-400 text-sm line-clamp-3 mb-4">
          {blog.content?.replace(/<[^>]+>/g, "").slice(0, 120)}...
        </p>

        {/* AUTHOR */}
        <Link to={`/author/${blog.author?._id}`} className="flex items-center gap-3 mt-auto mb-4">
          <img src={blog.author?.avatar || "/default.png"} alt="author"
            className="w-9 h-9 rounded-full object-cover" />
          <div>
            <p className="text-sm font-semibold">{blog.author?.username || "Unknown"}</p>
            <p className="text-xs text-white/40">{new Date(blog.createdAt).toDateString()}</p>
          </div>
        </Link>

        {/* OWNER ACTIONS */}
       {user?._id?.toString() === blog.author?._id?.toString() && (
  <div className="flex gap-2 mb-4">
    <button
      onClick={() => navigate(`/edit-blog/${blog._id}`)}
      className="flex-1 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/30 transition-all"
    >
      Edit
    </button>

    <button
      onClick={handleDelete}
      className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-all"
    >
      Delete
    </button>
  </div>
)}

        {/* ACTIONS */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition-all ${liked ? "text-pink-400" : "text-gray-400 hover:text-pink-400"}`}>
              <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likes}
            </button>
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <MessageCircle size={16} /> {blog.comments?.length || 0}
            </span>
          </div>

          <Link to={`/blog/${blog._id}`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-sm font-bold hover:scale-105 transition-all">
            Read
          </Link>
        </div>
      </div>
    </motion.div>
  );
}