import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { Heart,Bookmark, Eye, Clock,Send,Trash2,Edit,Check,X,} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import SEO from "../components/SEO";
import DOMPurify from "dompurify";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchBlog = async () => {
    try {
      const { data } = await API.get(`/blogs/${id}`);
      setBlog(data.data?.blog || data.blog);
      setComments(data.data?.comments || data.comments || []);
    } catch (err) {
      toast.error("Blog not found");
      navigate("/");
    }
  };

  const fetchRelated = async (blogData) => {
    try {
      const { data } = await API.get(`/blogs/related/${blogData._id}`);
      setRelatedBlogs(data.data || []);
    } catch {}
  };

  useEffect(() => {
    if (blog) fetchRelated(blog);
  }, [blog]);

  const likeBlog = async () => {
    if (!token) return toast.error("Login required");
    try {
      await API.put(`/blogs/like/${id}`, {});
      fetchBlog();
      toast.success("Liked!");
    } catch {
      toast.error("Failed to like");
    }
  };

  const handleBookmark = async () => {
    if (!token) return toast.error("Login required");
    try {
      await API.put("/users/bookmark", { blogId: blog._id });
      toast.success("Bookmark updated");
    } catch {
      toast.error("Bookmark failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await API.delete(`/blogs/${blog._id}`);
      toast.success("Blog deleted");
      navigate("/");
    } catch {
      toast.error("Delete failed");
    }
  };

  const addComment = async () => {
    if (!token) return toast.error("Login required");
    if (!text.trim()) return toast.error("Comment cannot be empty");
    try {
      setCommentLoading(true);
      // FIX: Use commentRoutes — /api/comments/:blogId
      await API.post(`/comments/${id}`, { text });
      setText("");
      fetchBlog();
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
  if (!window.confirm("Delete this comment?")) return;

  try {
    await API.delete(`/comments/delete/${commentId}`);
    fetchBlog();
    toast.success("Comment deleted");
  } catch {
    toast.error("Delete failed");
  }
};

const updateComment = async (commentId) => {
  if (!editText.trim()) return;

  try {
    await API.put(`/comments/${commentId}`, {
      text: editText,
    });

    setEditingComment(null);
    setEditText("");
    fetchBlog();
    toast.success("Comment updated");
  } catch {
    toast.error("Update failed");
  }
};

  const isLiked = blog?.likes?.includes(user?._id);
  const canEdit = user?._id === blog?.author?._id || user?.role === "admin";

  if (!blog) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-24 pb-20">
      <SEO
  title={blog.seoTitle || blog.title}
  description={blog.seoDescription || blog.content?.replace(/<[^>]+>/g, "").slice(0, 160)}
  image={blog.image}
  url={`${window.location.origin}/blog/${blog._id}`}
  type="article"
/>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* THUMBNAIL */}
        {blog.image && (
          <img src={blog.image} alt={blog.title}
            className="w-full h-[400px] object-cover rounded-3xl mb-10 shadow-2xl" />
        )}

        {/* META */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <span className="px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-semibold">
            {blog.category}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-sm">
            <Clock size={14} /> {blog.readingTime}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-sm">
            <Eye size={14} /> {blog.views} views
          </span>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6">{blog.title}</h1>

        {/* AUTHOR */}
        <div className="flex items-center gap-4 mb-10">
          <Link to={`/author/${blog.author?._id}`}>
            <img src={blog.author?.avatar || "/default.png"} alt=""
              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500" />
          </Link>
          <div>
            <Link to={`/author/${blog.author?._id}`}
              className="font-bold hover:text-cyan-400 transition">{blog.author?.username}</Link>
            <p className="text-gray-400 text-sm">{new Date(blog.createdAt).toDateString()}</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button onClick={likeBlog}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all ${
              isLiked ? "bg-pink-500 text-white" : "bg-white/5 border border-white/10 hover:bg-pink-500/20"}`}>
            <Heart size={18} fill={isLiked ? "white" : "none"} />
            {blog.likes?.length || 0}
          </button>

          <button onClick={handleBookmark}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-cyan-500/20 transition-all">
            <Bookmark size={18} /> Bookmark
          </button>

          {canEdit && (
            <>
              <button onClick={() => navigate(`/edit-blog/${blog._id}`)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all">
                <Edit size={18} /> Edit
              </button>
              <button onClick={handleDelete}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all">
                <Trash2 size={18} /> Delete
              </button>
            </>
          )}
        </div>

        {/* TAGS */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {blog.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CONTENT */}
        <div className="prose prose-invert max-w-none text-lg leading-loose text-gray-200"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content?.replace(/\n/g, "<br/>") || "") }} />

        {/* RELATED BLOGS */}
        {relatedBlogs.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-black mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedBlogs.map((rb) => (
                <Link to={`/blog/${rb._id}`} key={rb._id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
                  <span className="text-cyan-400 text-xs font-semibold">{rb.category}</span>
                  <h3 className="font-bold mt-2 line-clamp-2">{rb.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{rb.readingTime}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* COMMENTS */}
        <div className="mt-20">
          <h2 className="text-3xl font-black mb-8">Comments ({comments.length})</h2>

          {/* ADD COMMENT */}
          <div className="flex gap-3 mb-10">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              placeholder="Write a comment..."
              className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 transition-all" />
            <button onClick={addComment} disabled={commentLoading}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 font-bold flex items-center gap-2 disabled:opacity-60">
              <Send size={18} /> {commentLoading ? "..." : "Send"}
            </button>
          </div>

          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-center text-gray-500 py-10">No comments yet. Be the first!</p>
            )}
            {comments.map((comment) => (
  <div
    key={comment._id}
    className="bg-white/5 border border-white/10 p-5 rounded-2xl"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <img
          src={comment.user?.avatar || "/default.png"}
          className="w-9 h-9 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default.png";
          }}
        />

        <div>
          <p className="font-semibold text-sm">
            {comment.user?.username}
          </p>

          <p className="text-xs text-gray-500">
            {new Date(comment.createdAt).toDateString()}
            {comment.edited && (
              <span className="ml-2 text-gray-600">
                (edited)
              </span>
            )}
          </p>
        </div>
      </div>

      {user &&
        (user._id === comment.user?._id ||
          user.role === "admin") && (
          <div className="flex gap-2">
            {user._id === comment.user?._id && (
              <button
                onClick={() => {
                  setEditingComment(comment._id);
                  setEditText(comment.text);
                }}
                className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition"
              >
                <Edit size={13} />
              </button>
            )}

            <button
              onClick={() =>
                deleteComment(comment._id)
              }
              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
    </div>

    {editingComment === comment._id ? (
      <div className="flex gap-2 mt-2">
        <input
          value={editText}
          onChange={(e) =>
            setEditText(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            updateComment(comment._id)
          }
          className="flex-1 p-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 text-sm"
        />

        <button
          onClick={() =>
            updateComment(comment._id)
          }
          className="p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition"
        >
          <Check size={14} />
        </button>

        <button
          onClick={() => {
            setEditingComment(null);
            setEditText("");
          }}
          className="p-2 rounded-xl bg-white/10 text-gray-400 hover:bg-white/20 transition"
        >
          <X size={14} />
        </button>
      </div>
    ) : (
      <p className="text-gray-300">
        {comment.text}
      </p>
    )}
  </div>
))}
          </div>
        </div>
      </div>
    </div>
  );
}