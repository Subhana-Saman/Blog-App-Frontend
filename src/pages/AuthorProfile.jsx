import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../utils/api";
import toast from "react-hot-toast";
import { Users, FileText, UserCheck, UserPlus } from "lucide-react";
import { MessageCircle } from "lucide-react";

export default function AuthorProfile() {
  const { id } = useParams();
  const { token, user: currentUser } = useSelector((state) => state.auth);

  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/users/profile/${id}`);
      setAuthor(data.user);
      setBlogs(data.blogs || []);
      setIsFollowing(data.isFollowing);
    } catch {
      toast.error("Profile not found");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!token) return toast.error("Login required");
    try {
      setFollowLoading(true);
      const { data } = await API.put(`/users/follow/${id}`);
      setIsFollowing(data.following);
      setAuthor((prev) => ({ ...prev, followersCount: data.followersCount }));
      toast.success(data.message);
    } catch {
      toast.error("Failed");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
    </div>
  );

  if (!author) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* PROFILE HEADER */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-16 p-8 rounded-3xl bg-white/5 border border-white/10">
          <img src={author.avatar || "/default.png"} alt={author.username}
            className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-lg" />

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-4xl font-black">{author.username}</h1>
            <p className="text-gray-400 mt-2 max-w-lg">{author.bio || "No bio yet."}</p>

            <div className="flex flex-wrap gap-6 mt-6 justify-center sm:justify-start">
              <div className="text-center">
                <p className="text-2xl font-black">{author.followersCount}</p>
                <p className="text-gray-400 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black">{author.followingCount}</p>
                <p className="text-gray-400 text-sm">Following</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black">{blogs.length}</p>
                <p className="text-gray-400 text-sm">Blogs</p>
              </div>
            </div>

            {/* FOLLOW BUTTON */}
            {currentUser?._id !== id && (
              <button onClick={handleFollow} disabled={followLoading}
                className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-60 ${
                  isFollowing
                    ? "bg-white/10 border border-white/20 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                    : "bg-gradient-to-r from-cyan-500 to-teal-500"}`}>
                {isFollowing ? <><UserCheck size={18} /> Following</> : <><UserPlus size={18} /> Follow</>}
              </button>
            )}
          </div>
        </div>
        
        {currentUser?._id !== id && (
  <Link to={`/messages?user=${id}`}
    className="mt-6 ml-3 inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white/10 border border-white/20 hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all">
    <MessageCircle size={18} /> Message
  </Link>
)}

        {/* BLOGS */}
        <h2 className="text-3xl font-black mb-8">
          <FileText className="inline mr-3 text-cyan-400" size={28} />
          Blogs by {author.username}
        </h2>

        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 py-20 text-lg">No blogs published yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link to={`/blog/${blog._id}`} key={blog._id}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:scale-[1.02] transition-all">
                {blog.image && (
                  <img src={blog.image} alt={blog.title}
                    className="w-full h-44 object-cover rounded-xl mb-4" />
                )}
                <span className="text-xs text-cyan-400 font-semibold">{blog.category}</span>
                <h3 className="font-bold mt-2 line-clamp-2 text-lg">{blog.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{blog.readingTime}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}