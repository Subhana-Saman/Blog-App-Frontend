import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardLayout from "./layout/DashboardLayout";
import { Toaster } from "react-hot-toast";
import VerifyEmailBanner from "./components/VerifyEmailBanner";


const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const EditBlog = lazy(() => import("./pages/EditBlog"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const AuthorProfile = lazy(() => import("./pages/AuthorProfile"));
const SavedBlogs = lazy(() => import("./pages/SavedBlogs"));
const Messages = lazy(() => import("./pages/Messages"));
const AITools = lazy(() => import("./pages/AITools"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#020617]">
    <div className="w-16 h-16 rounded-full border-4 border-teal-400 border-t-transparent animate-spin" />
  </div>
);

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
      }} />

      <div className="min-h-screen bg-white text-black dark:bg-[#020617] dark:text-white transition-all duration-300">
        <Navbar />
        <VerifyEmailBanner />

        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/author/:id" element={<AuthorProfile />} />
            <Route path="/admin/analytics" element={<AdminRoute><DashboardLayout><AdminAnalytics /></DashboardLayout></AdminRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/create-blog" element={<ProtectedRoute><DashboardLayout><CreateBlog /></DashboardLayout></ProtectedRoute>} />
            <Route path="/edit-blog/:id" element={<ProtectedRoute><DashboardLayout><EditBlog /></DashboardLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
            <Route path="/saved-blogs" element={<ProtectedRoute><SavedBlogs /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/ai-tools" element={<ProtectedRoute><DashboardLayout><AITools /></DashboardLayout></ProtectedRoute>} />
           <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/admin" element={<AdminRoute><DashboardLayout><AdminDashboard /></DashboardLayout></AdminRoute>} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}