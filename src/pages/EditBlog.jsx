import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

 const [formData, setFormData] = useState({
  title: "", category: "", tags: "", content: "",
  seoTitle: "", seoDescription: "",  // ADD KARO
});

  useEffect(() => { fetchBlog(); }, []);

  const fetchBlog = async () => {
    try {
      const { data } = await API.get(`/blogs/${id}`);
      const blog = data.data?.blog || data.blog;
     setFormData({
  title: blog.title || "",
  category: blog.category || "",
  tags: blog.tags?.join(", ") || "",
  content: blog.content || "",
  seoTitle: blog.seoTitle || "",        // ADD
  seoDescription: blog.seoDescription || "",  // ADD
});
    } catch {
      toast.error("Failed to load blog");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.put(`/blogs/${id}`, {
  ...formData,
  tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
});
      toast.success("Blog updated successfully");
      navigate("/dashboard");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400 transition-all";

  return (
    <div className="min-h-screen pt-28 px-4 bg-[#020617] text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-10 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Edit Blog
        </h1>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Title" value={formData.title} required minLength={5}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} />
            <input type="text" placeholder="Category" value={formData.category} required
              onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={inputClass} />
          </div>

          <input type="text" placeholder="Tags (comma separated)" value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className={inputClass} />

          <textarea rows={12} placeholder="Content..." value={formData.content} required minLength={50}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className={`${inputClass} resize-none`} />

            {/* SEO SECTION */}
<details className="rounded-2xl border border-white/10 bg-black/20 p-4">
  <summary className="cursor-pointer text-sm font-semibold text-cyan-400">
    SEO Settings (optional)
  </summary>
  <div className="mt-4 space-y-4">
    <div>
      <label className="text-xs text-gray-400 mb-1 block">SEO Title (defaults to blog title)</label>
      <input
        type="text"
        placeholder="Custom SEO title for search engines"
        value={formData.seoTitle}
        maxLength={60}
        onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
        className={inputClass}
      />
      <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60 characters</p>
    </div>
    <div>
      <label className="text-xs text-gray-400 mb-1 block">SEO Description</label>
      <textarea
        rows={2}
        placeholder="Brief description for search results (150 chars)"
        value={formData.seoDescription}
        maxLength={160}
        onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
        className={`${inputClass} resize-none`}
      />
      <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160 characters</p>
    </div>
  </div>
</details>

          <div className="flex gap-4">
            <button type="submit" disabled={loading}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 font-bold disabled:opacity-60 hover:scale-[1.02] transition-all">
              {loading ? "Updating..." : "Update Blog"}
            </button>
            <button type="button" onClick={() => navigate("/dashboard")}
              className="px-8 py-4 rounded-2xl bg-white/10 border border-white/10 font-bold hover:bg-white/20 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}