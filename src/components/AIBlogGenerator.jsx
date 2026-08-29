import { useState } from "react";
import { useSelector } from "react-redux";
import API from "../utils/api";
import toast from "react-hot-toast";
import {
  Sparkles, Tag, FileText, Wand2,
  BookOpen, Copy, Check, ChevronDown, ChevronUp
} from "lucide-react";

export default function AIBlogGenerator() {
  const { token } = useSelector((state) => state.auth);

  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [improveText, setImproveText] = useState("");
  const [improved, setImproved] = useState("");
  const [summarizeText, setSummarizeText] = useState("");
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  // ============ GENERATE ============
  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Enter a topic first");
    try {
      setLoading(true);
      setResult(null);
      const { data } = await API.post("/ai/generate", { prompt }, { headers });
      setResult(data.data);
      toast.success("Blog generated!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  // ============ IMPROVE ============
  const handleImprove = async () => {
    if (!improveText.trim()) return toast.error("Paste content to improve");
    try {
      setLoading(true);
      const { data } = await API.post("/ai/improve", { content: improveText }, { headers });
      setImproved(data.improved);
      toast.success("Content improved!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  // ============ SUMMARIZE ============
  const handleSummarize = async () => {
    if (!summarizeText.trim()) return toast.error("Paste content to summarize");
    try {
      setLoading(true);
      const { data } = await API.post("/ai/summarize", { content: summarizeText }, { headers });
      setSummary(data.summary);
      toast.success("Summarized!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "generate", label: "Generate Blog", icon: <Sparkles size={16} /> },
    { id: "improve",  label: "Improve",        icon: <Wand2 size={16} /> },
    { id: "summarize",label: "Summarize",       icon: <BookOpen size={16} /> },
  ];

  return (
    <div className="mt-16 rounded-3xl bg-white/5 border border-white/10 overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-teal-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
            <Sparkles className="text-cyan-400" size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black">AI Writing Assistant</h2>
            <p className="text-gray-400 text-sm">Powered by Gemini 2.0</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mt-5">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">

        {/* ===== TAB: GENERATE ===== */}
        {activeTab === "generate" && (
          <div className="space-y-5">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter blog topic... e.g. 'React Server Components explained'"
              rows={4}
              className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400 transition-all resize-none text-white placeholder-gray-500"
            />

            <button onClick={handleGenerate} disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-60 hover:scale-[1.01] transition-all">
              <Sparkles size={20} />
              {loading ? "Generating..." : "Generate Complete Blog"}
            </button>

            {/* RESULT */}
            {result && (
              <div className="mt-6 space-y-4">

                {/* SEO TITLE */}
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-xs text-cyan-400 font-semibold mb-1">SEO TITLE</p>
                  <p className="font-bold text-lg">{result.seoTitle}</p>
                </div>

                {/* META */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-400 font-semibold mb-1">META DESCRIPTION</p>
                  <p className="text-gray-300">{result.metaDescription}</p>
                </div>

                {/* TAGS */}
                {result.tags?.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-400 font-semibold mb-3 flex items-center gap-2">
                      <Tag size={12} /> TAGS
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm font-semibold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-400 font-semibold flex items-center gap-2">
                      <FileText size={12} /> BLOG CONTENT
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => copyToClipboard(result.content)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 text-xs hover:bg-white/20 transition-all">
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                      <button onClick={() => setShowContent(!showContent)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 text-xs hover:bg-white/20 transition-all">
                        {showContent ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {showContent ? "Hide" : "Preview"}
                      </button>
                    </div>
                  </div>

                  {showContent && (
                    <div className="mt-3 p-4 rounded-xl bg-black/30 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {result.content}
                    </div>
                  )}
                </div>

                {/* THUMBNAIL IDEA */}
                {result.thumbnailIdea && (
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                    <p className="text-xs text-purple-400 font-semibold mb-1">THUMBNAIL IDEA</p>
                    <p className="text-gray-300 text-sm">{result.thumbnailIdea}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== TAB: IMPROVE ===== */}
        {activeTab === "improve" && (
          <div className="space-y-4">
            <textarea value={improveText} onChange={(e) => setImproveText(e.target.value)}
              placeholder="Paste your blog content here to improve grammar, structure and tone..."
              rows={8}
              className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400 transition-all resize-none text-white placeholder-gray-500" />

            <button onClick={handleImprove} disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold flex items-center justify-center gap-3 disabled:opacity-60 hover:scale-[1.01] transition-all">
              <Wand2 size={20} />
              {loading ? "Improving..." : "Improve Content"}
            </button>

            {improved && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-bold text-green-400">✅ Improved Content</p>
                  <button onClick={() => copyToClipboard(improved)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 text-xs hover:bg-white/20 transition-all">
                    <Copy size={12} /> Copy
                  </button>
                </div>
                <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                  {improved}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== TAB: SUMMARIZE ===== */}
        {activeTab === "summarize" && (
          <div className="space-y-4">
            <textarea value={summarizeText} onChange={(e) => setSummarizeText(e.target.value)}
              placeholder="Paste long blog content here to get a quick 3-point summary..."
              rows={8}
              className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400 transition-all resize-none text-white placeholder-gray-500" />

            <button onClick={handleSummarize} disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 font-bold flex items-center justify-center gap-3 disabled:opacity-60 hover:scale-[1.01] transition-all">
              <BookOpen size={20} />
              {loading ? "Summarizing..." : "Summarize Blog"}
            </button>

            {summary && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-sm font-bold text-yellow-400 mb-3">📝 Summary</p>
                <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {summary}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}