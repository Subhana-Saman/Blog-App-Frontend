import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { FileText, Eye, Heart, Users, Sparkles, ArrowRight, Edit, Trash2, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalBlogs: 0, totalUsers: 0, totalViews: 0, totalLikes: 0 });
  const [myBlogs, setMyBlogs] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [tab, setTab] = useState("published");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchMyBlogs();
    fetchDrafts();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/dashboard/stats");
      setStats(data.stats || {});
    } catch {}
  };

  const fetchMyBlogs = async () => {
    try {
      const { data } = await API.get("/blogs/my-blogs");
      setMyBlogs(data.data || data.blogs || []);
    } catch {}
  };

  const fetchDrafts = async () => {
    try {
      const { data } = await API.get("/blogs/my-drafts");
      setDrafts(data.data || data.blogs || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await API.delete(`/blogs/${id}`);
      toast.success("Deleted");
      fetchMyBlogs();
      fetchDrafts();
    } catch { toast.error("Delete failed"); }
  };

  const publishDraft = async (id) => {
    try {
      await API.put(`/blogs/${id}`, { draft: false });
      toast.success("Blog published!");
      fetchMyBlogs();
      fetchDrafts();
    } catch { toast.error("Failed to publish"); }
  };

  const cards = [
    { title: "My Blogs", value: stats.totalBlogs, icon: <FileText size={24} />, color: "cyan" },
    { title: "Total Users", value: stats.totalUsers, icon: <Users size={24} />, color: "purple" },
    { title: "Total Views", value: stats.totalViews, icon: <Eye size={24} />, color: "yellow" },
    { title: "Total Likes", value: stats.totalLikes, icon: <Heart size={24} />, color: "pink" },
  ];

  const colorMap = {
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
    yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400",
    pink: "from-pink-500/20 to-pink-500/5 border-pink-500/20 text-pink-400",
  };

  const BlogRow = ({ blog, isDraft }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all gap-4">
      <div className="flex items-center gap-4 overflow-hidden">
        {blog.image && (
          <img src={blog.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
            onError={(e) => { e.target.style.display = "none"; }} />
        )}
        <div className="overflow-hidden">
          <p className="font-semibold truncate">{blog.title}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span>{blog.category}</span>
            {!isDraft && <><span>·</span><span><Eye size={10} className="inline mr-1" />{blog.views || 0}</span></>}
            {!isDraft && <><span>·</span><span><Heart size={10} className="inline mr-1" />{blog.likes?.length || 0}</span></>}
            {isDraft && <span className="text-yellow-400 flex items-center gap-1"><Clock size={10} /> Draft</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isDraft && (
          <button onClick={() => publishDraft(blog._id)}
            className="px-3 py-1.5 rounded-xl bg-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/30 transition">
            Publish
          </button>
        )}
        <button onClick={() => navigate(`/edit-blog/${blog._id}`)}
          className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition">
          <Edit size={14} />
        </button>
        <button onClick={() => handleDelete(blog._id)}
          className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-10 pb-20">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-black">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back, {user?.username}!</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((c) => (
          <div key={c.title} className={`p-6 rounded-3xl bg-gradient-to-br border ${colorMap[c.color]}`}>
            <div className="flex items-center justify-between mb-3">
              {c.icon}
              <span className="text-3xl font-black">{loading ? "—" : (c.value || 0)}</span>
            </div>
            <p className="text-sm text-gray-300">{c.title}</p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link to="/create-blog"
          className="p-5 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-cyan-400" size={22} />
            <span className="font-bold">Write New Blog</span>
          </div>
          <ArrowRight className="text-cyan-400 group-hover:translate-x-1 transition-transform" size={20} />
        </Link>

        <Link to="/ai-tools"
          className="p-5 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-purple-400" size={22} />
            <span className="font-bold">AI Writing Tools</span>
          </div>
          <ArrowRight className="text-purple-400 group-hover:translate-x-1 transition-transform" size={20} />
        </Link>
      </div>

      {/* MY BLOGS + DRAFTS */}
      <div>
        {/* TABS */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("published")}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              tab === "published" ? "bg-cyan-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            Published ({myBlogs.length})
          </button>
          <button onClick={() => setTab("drafts")}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              tab === "drafts" ? "bg-yellow-500 text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            Drafts ({drafts.length})
          </button>
        </div>

        {/* PUBLISHED */}
        {tab === "published" && (
          <div className="space-y-3">
            {myBlogs.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 opacity-30" />
                <p>No published blogs yet</p>
                <Link to="/create-blog" className="mt-4 inline-block px-6 py-3 rounded-2xl bg-cyan-500 text-white font-bold text-sm">
                  Write your first blog
                </Link>
              </div>
            ) : (
              myBlogs.map((blog) => <BlogRow key={blog._id} blog={blog} isDraft={false} />)
            )}
          </div>
        )}

        {/* DRAFTS */}
        {tab === "drafts" && (
          <div className="space-y-3">
            {drafts.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Clock size={48} className="mx-auto mb-4 opacity-30" />
                <p>No drafts saved</p>
              </div>
            ) : (
              drafts.map((blog) => <BlogRow key={blog._id} blog={blog} isDraft={true} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}