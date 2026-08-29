import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    try {
      const { data } = await API.get(`/auth/verify-email/${token}`);
      setStatus("success");
      setMessage(data.message);
    } catch (err) {
      setStatus("error");
      setMessage(err?.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#020617]">
      <div className="w-full max-w-md p-10 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl text-center">
        {status === "loading" && (
          <>
            <Loader className="mx-auto animate-spin text-cyan-400 mb-4" size={48} />
            <h2 className="text-2xl font-black">Verifying...</h2>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
            <h2 className="text-2xl font-black mb-2">Email Verified!</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <Link to="/login" className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 font-bold inline-block">
              Go to Login
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-400 mb-4" size={48} />
            <h2 className="text-2xl font-black mb-2">Verification Failed</h2>
            <p className="text-gray-400">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}