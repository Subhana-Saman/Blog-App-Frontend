import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match");
    if (password.length < 8) return toast.error("Minimum 8 characters required");

    try {
      setLoading(true);
      await API.put(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed — link may have expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#020617]">
      <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <h1 className="text-3xl font-black mb-2">Reset Password</h1>
        <p className="text-gray-400 mb-8">Enter your new password below.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPass ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password" required minLength={8}
              className="w-full pl-11 pr-11 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 transition-all"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPass ? "text" : "password"} value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password" required
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          {password && (
            <div className="flex gap-1">
              {[1,2,3,4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                  password.length >= i * 2
                    ? i <= 1 ? "bg-red-500" : i <= 2 ? "bg-yellow-500" : i <= 3 ? "bg-blue-500" : "bg-green-500"
                    : "bg-white/10"}`} />
              ))}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-teal-500 hover:scale-[1.02] transition-all disabled:opacity-60">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}