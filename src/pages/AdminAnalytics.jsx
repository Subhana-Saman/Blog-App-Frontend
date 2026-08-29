import { useEffect, useState } from "react";
import API from "../utils/api";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { BarChart3, TrendingUp, Eye, Heart } from "lucide-react";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const COLORS = ["#22d3ee", "#2dd4bf", "#a78bfa", "#f472b6", "#fb923c", "#facc15", "#34d399", "#60a5fa"];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get("/admin/analytics");
      setData(data.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
    </div>
  );

  if (!data) return null;

  // Format month data: [{ month: "Jan", count: 5 }]
  const formatMonthly = (arr) =>
    arr.map((item) => ({
      month: MONTH_NAMES[item._id.month - 1],
      count: item.count,
    }));

  const blogsPerMonth = formatMonthly(data.blogsPerMonth);
  const usersPerMonth = formatMonthly(data.usersPerMonth);

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-10 pb-20 text-white">
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 className="text-cyan-400" size={32} />
        <h1 className="text-4xl sm:text-5xl font-black">Analytics</h1>
      </div>
      <p className="text-gray-400 mb-10">Platform insights and growth metrics.</p>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* BLOGS PER MONTH */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-cyan-400" size={20} />
            <h2 className="text-xl font-bold">Blogs Published (6 months)</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={blogsPerMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #ffffff20", borderRadius: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={3} dot={{ fill: "#22d3ee", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* NEW USERS PER MONTH */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-teal-400" size={20} />
            <h2 className="text-xl font-bold">New Users (6 months)</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={usersPerMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #ffffff20", borderRadius: 12 }} />
              <Bar dataKey="count" fill="#2dd4bf" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY DISTRIBUTION */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-purple-400" size={20} />
            <h2 className="text-xl font-bold">Blogs by Category</h2>
          </div>
          {data.categoryStats.length === 0 ? (
            <p className="text-gray-500 text-center py-16">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.categoryStats}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%" cy="50%"
                  outerRadius={90}
                  label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {data.categoryStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #ffffff20", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* TOP BLOGS BY VIEWS */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <Eye className="text-yellow-400" size={20} />
            <h2 className="text-xl font-bold">Top 5 Blogs by Views</h2>
          </div>
          {data.topBlogs.length === 0 ? (
            <p className="text-gray-500 text-center py-16">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.topBlogs.map((blog, i) => (
                <div key={blog._id} className="flex items-center justify-between p-3 rounded-2xl bg-black/20">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm font-semibold line-clamp-1">{blog.title}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 flex-shrink-0">
                    <span className="flex items-center gap-1"><Eye size={12} /> {blog.views}</span>
                    <span className="flex items-center gap-1"><Heart size={12} /> {blog.likes?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}