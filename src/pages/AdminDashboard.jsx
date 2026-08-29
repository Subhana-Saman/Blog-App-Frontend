import { useEffect, useState } from "react";
import API from "../utils/api";
import {
  Users, FileText, Eye, Heart, Trash2, BarChart3, Shield,
  Search, Ban, CheckCircle, X,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AdminAnalytics from "./AdminAnalytics";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalBlogs: 0, totalUsers: 0, totalViews: 0, totalLikes: 0 });
  const [tab, setTab] = useState("overview"); // overview | users | blogs | analytics
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (tab === "users") fetchUsers();
    if (tab === "blogs") fetchBlogs();
  }, [tab]);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/dashboard/stats");
      setStats(data.stats || stats);
    } catch {} finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get(`/admin/users?search=${search}`);
      setUsers(data.data || []);
    } catch { toast.error("Failed to load users"); }
  };

  const fetchBlogs = async () => {
    try {
      const { data } = await API.get(`/admin/blogs?search=${search}`);
      setBlogs(data.data || []);
    } catch { toast.error("Failed to load blogs"); }
  };

  const handleBan = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/ban`);
      toast.success(data.message);
      fetchUsers();
    } catch { toast.error("Action failed"); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user and ALL their content? Cannot be undone.")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch { toast.error("Delete failed"); }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Remove this blog?")) return;
    try {
      await API.delete(`/admin/blogs/${id}`);
      toast.success("Blog removed");
      fetchBlogs();
    } catch { toast.error("Delete failed"); }
  };

  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: <Users size={28} />, color: "cyan" },
    { title: "Total Blogs", value: stats.totalBlogs, icon: <FileText size={28} />, color: "purple" },
    { title: "Total Views", value: stats.totalViews, icon: <Eye size={28} />, color: "yellow" },
    { title: "Total Likes", value: stats.totalLikes, icon: <Heart size={28} />, color: "pink" },
  ];

  const colorMap = {
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    pink: "bg-pink-500/10 border-pink-500/20 text-pink-400",
  };

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-10 pb-20 text-white">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="text-cyan-400" size={32} />
        <h1 className="text-4xl sm:text-5xl font-black">Admin Dashboard</h1>
      </div>
      <p className="text-gray-400 mb-10">Manage users, blogs, and platform analytics.</p>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((c) => (
          <div key={c.title} className={`p-6 rounded-3xl border ${colorMap[c.color]}`}>
            <div className="flex items-center justify-between">
              {c.icon}
              <span className="text-3xl font-black">{loading ? "—" : c.value}</span>
            </div>
            <p className="mt-3 text-sm text-gray-300">{c.title}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {[
          { id: "overview", label: "Overview", icon: <BarChart3 size={16} /> },
          { id: "users", label: "Manage Users", icon: <Users size={16} /> },
          { id: "blogs", label: "Manage Blogs", icon: <FileText size={16} /> },
          { id: "analytics", label: "Analytics", icon: <BarChart3 size={16} /> }
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              tab === t.id ? "bg-cyan-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="p-10 rounded-3xl bg-white/5 border border-white/10 text-center text-gray-400">
          Select "Manage Users" or "Manage Blogs" tab to moderate content.
        </div>
      )}

      {/* USERS TAB */}
      {tab === "users" && (
        <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/10 relative">
            <Search className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
              placeholder="Search by username or email..."
              className="w-full pl-10 p-3 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Blogs</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 flex items-center gap-3">
       <img
  src={u.avatar?.startsWith("http") ? u.avatar : "/default.png"}
  className="w-8 h-8 rounded-full"
  onError={(e) => { e.target.onerror = null; e.target.src = "/default.png"; }}
/>
                      {u.username}
                    </td>
                    <td className="p-4 text-gray-400">{u.email}</td>
                    <td className="p-4">{u.blogCount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-xs ${u.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-white/10 text-gray-300"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.isBanned ? (
                        <span className="px-2 py-1 rounded-lg text-xs bg-red-500/20 text-red-400">Banned</span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-xs bg-green-500/20 text-green-400">Active</span>
                      )}
                    </td>
                    <td className="p-4">
                      {u.role !== "admin" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleBan(u._id)}
                            className={`p-2 rounded-xl ${u.isBanned ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                            {u.isBanned ? <CheckCircle size={14} /> : <Ban size={14} />}
                          </button>
                          <button onClick={() => handleDeleteUser(u._id)}
                            className="p-2 rounded-xl bg-red-500/20 text-red-400">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="text-center text-gray-500 py-10">No users found</p>}
          </div>
        </div>
      )}

      {/* BLOGS TAB */}
      {tab === "blogs" && (
        <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/10 relative">
            <Search className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchBlogs()}
              placeholder="Search by title..."
              className="w-full pl-10 p-3 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <div className="divide-y divide-white/5">
            {blogs.map((b) => (
              <div key={b._id} className="p-4 flex items-center justify-between hover:bg-white/5">
                <div className="flex items-center gap-3">
                  {b.image && <img src={b.image} className="w-14 h-14 rounded-xl object-cover" />}
                  <div>
                    <p className="font-semibold line-clamp-1">{b.title}</p>
                    <p className="text-xs text-gray-400">by {b.author?.username} · {b.views} views · {b.likes?.length || 0} likes</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteBlog(b._id)}
                  className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {blogs.length === 0 && <p className="text-center text-gray-500 py-10">No blogs found</p>}
          </div>
        </div>
      )}

       {/* ANALYTICS TAB */}
{tab === "analytics" && (
  <div className="p-10 rounded-3xl bg-white/5 border border-white/10 text-center text-gray-400">
    Analytics dashboard yahan show hoga
  </div>
)}
    </div>
  );
 
}