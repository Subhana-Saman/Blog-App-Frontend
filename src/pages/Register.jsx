import { useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }
    try {
      setLoading(true);
      const { data } = await API.post("/auth/register", formData);
      toast.success(data.message || "Registered successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#020617]">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <h1 className="text-3xl sm:text-4xl font-black mb-2 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-center text-gray-400 mb-8">Join DevVerse today</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" name="username" placeholder="Username" onChange={handleChange}
              required minLength={3}
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 transition-all" />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 transition-all" />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type={showPass ? "text" : "password"} name="password" placeholder="Password (min 8 chars)"
              onChange={handleChange} required minLength={8}
              className="w-full pl-11 pr-11 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 transition-all" />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button disabled={loading}
            className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-teal-500 hover:scale-[1.02] transition-all disabled:opacity-60">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-500 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}