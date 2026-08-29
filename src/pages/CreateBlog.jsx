import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";
import { Upload, Tag, FileText, Layers } from "lucide-react";

const CATEGORY_OPTIONS = [
  "React", "JavaScript", "Node.js", "MERN", "AI",
  "Next.js", "CSS", "Python", "DevOps", "Other",
];

export default function CreateBlog() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  title: "", category: "", tags: "", content: "",
  seoTitle: "", seoDescription: "",  // ADD KARO
});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

const buildFormData = (isDraft = false) => {
  const data = new FormData();
  data.append("title", formData.title);
  data.append("category", formData.category);
  data.append("content", formData.content);
  data.append("tags", formData.tags);
  data.append("seoTitle", formData.seoTitle || formData.title);  // ADD
  data.append("seoDescription", formData.seoDescription || formData.content.slice(0, 150));  // ADD
  if (isDraft) data.append("draft", "true");
  if (image) data.append("image", image);
  return data;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/blogs/create", buildFormData(false));
      toast.success(res.data.message || "Blog published!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDraft = async () => {
    try {
      await API.post("/blogs/create", buildFormData(true));
      toast.success("Draft saved");
    } catch {
      toast.error("Draft failed");
    }
  };

  const inputClass =
    "w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none focus:border-teal-400 transition-all text-white placeholder-gray-500";

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-10 bg-[#020617] text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Create Blog
          </h1>
          <p className="text-gray-400 mt-3">
            Share your knowledge with developers worldwide.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6"
        >
          {/* TITLE */}
          <div className="relative">
            <FileText
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Blog Title"
              value={formData.title}
              required
              minLength={5}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`${inputClass} pl-11`}
            />
          </div>

          {/* CATEGORY */}
          <div className="relative">
            <Layers
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={formData.category}
              required
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`${inputClass} pl-11 appearance-none`}
            >
              <option value="" disabled>
                Select Category
              </option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c} className="bg-[#0f172a]">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* TAGS */}
          <div className="relative">
            <Tag
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tags (React, MERN, AI)"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className={`${inputClass} pl-11`}
            />
          </div>

          {/* CONTENT */}
          <textarea
            rows={14}
            required
            minLength={50}
            placeholder="Write your blog content..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className={`${inputClass} resize-none`}
          />
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

          {/* IMAGE UPLOAD */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border border-dashed border-white/20 hover:border-cyan-400 transition-all">
              <Upload size={20} className="text-cyan-400" />
              <span className="text-gray-400">
                {image ? image.name : "Upload thumbnail image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="mt-4 w-full h-52 object-cover rounded-2xl"
              />
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 font-bold hover:scale-[1.02] transition-all disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish Blog"}
            </button>

            <button
              type="button"
              onClick={handleDraft}
              className="px-8 py-4 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold hover:bg-yellow-500/30 transition-all"
            >
              Save Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}