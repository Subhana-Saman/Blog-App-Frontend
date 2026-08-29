import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#020617]">
      <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-sm transition-all">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="text-green-400" size={28} />
            </div>
            <h2 className="text-2xl font-black mb-2">Email Sent!</h2>
            <p className="text-gray-400">Check your inbox for the reset link. It expires in 10 minutes.</p>
            <Link to="/login" className="mt-6 inline-block px-6 py-3 rounded-2xl bg-cyan-500 font-bold hover:scale-[1.02] transition-all">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-black mb-2">Forgot Password?</h1>
            <p className="text-gray-400 mb-8">Enter your email — we'll send a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" required
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 transition-all"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-teal-500 hover:scale-[1.02] transition-all disabled:opacity-60">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}