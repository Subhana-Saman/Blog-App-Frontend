import AIBlogGenerator from "../components/AIBlogGenerator";
import { Sparkles } from "lucide-react";

export default function AITools() {
  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-10 pb-20">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
          <Sparkles className="text-cyan-400" size={24} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black">AI Tools</h1>
      </div>
      <p className="text-gray-400 mb-10">Generate, improve, and summarize blog content using AI.</p>

      <AIBlogGenerator />
    </div>
  );
}