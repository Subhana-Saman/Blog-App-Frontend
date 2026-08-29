import { useState } from "react";
import { useSelector } from "react-redux";
import { Mail, X } from "lucide-react";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function VerifyEmailBanner() {
  const { user, token } = useSelector((state) => state.auth);
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  if (!token || !user || user.emailVerified || dismissed) return null;

  const handleResend = async () => {
    try {
      setSending(true);
      const { data } = await API.post("/auth/resend-verification");
      toast.success(data.message || "Verification email sent");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-yellow-300">
          <Mail size={16} />
          <span>Please verify your email address to unlock all features.</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResend}
            disabled={sending}
            className="text-sm font-semibold text-yellow-400 hover:underline disabled:opacity-50"
          >
            {sending ? "Sending..." : "Resend Email"}
          </button>
          <button onClick={() => setDismissed(true)} className="text-yellow-400/60 hover:text-yellow-400">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}