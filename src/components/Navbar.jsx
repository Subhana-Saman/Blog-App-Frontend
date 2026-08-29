import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, PenSquare, LayoutDashboard, Shield, House, User, Bookmark, MessageCircle, Sparkles, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { toast } from "react-hot-toast";
import NotificationBell from "./NotificationBell";
import API from "../utils/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [chatUnread, setChatUnread] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;
    const fetchUnread = async () => {
      try {
        const { data } = await API.get("/chat/unread-count");
        setChatUnread(data.data?.unreadCount || 0);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 20000);
    return () => clearInterval(interval);
  }, [token]);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    try { await API.post("/auth/logout"); } catch {}
    dispatch(logout());
    toast.success("Logged out");
    navigate("/login");
  };

  const navLinks = [
    { name: "Home",      path: "/",            icon: <House size={16} /> },
    { name: "Write",     path: "/create-blog", icon: <PenSquare size={16} /> },
    { name: "AI Tools",  path: "/ai-tools",    icon: <Sparkles size={16} /> },
    { name: "Dashboard", path: "/dashboard",   icon: <LayoutDashboard size={16} /> },
    { name: "Messages",  path: "/messages",    icon: <MessageCircle size={16} />, badge: chatUnread },
    { name: "Saved",     path: "/saved-blogs", icon: <Bookmark size={16} /> },
    { name: "Profile",   path: "/profile",     icon: <User size={16} /> },
    ...(user?.role === "admin" ? [{ name: "Admin", path: "/admin", icon: <Shield size={16} /> }] : []),
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-[#030712]/80 backdrop-blur-2xl">
      <nav className="max-w-7xl mx-auto h-[64px] px-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-xl sm:text-2xl font-black tracking-tight flex-shrink-0">
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            DevVerse
          </span>
        </Link>

        {/* DESKTOP — only show on xl+ */}
        <div className="hidden xl:flex items-center gap-0.5">
          {navLinks.map((item) => (
            <Link key={item.path} to={item.path}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                location.pathname === item.path
                  ? "bg-cyan-500/20 text-white border border-cyan-400/20"
                  : "text-gray-300 hover:text-white hover:bg-white/5"}`}>
              {item.icon} {item.name}
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-bold">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="ml-1"><NotificationBell /></div>

          {token ? (
            <button onClick={handleLogout}
              className="ml-1 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all font-semibold text-xs">
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <Link to="/login" className="ml-1 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 font-semibold text-xs">
              Login
            </Link>
          )}
        </div>

        {/* TABLET/MOBILE RIGHT SIDE */}
        <div className="xl:hidden flex items-center gap-2">
          <NotificationBell />
          <button onClick={() => setOpen(!open)}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 transition">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="xl:hidden bg-[#020617]/95 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navLinks.map((item) => (
              <Link key={item.path} to={item.path}
                className={`relative flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  location.pathname === item.path
                    ? "bg-cyan-500/20 text-white border border-cyan-500/20"
                    : "text-gray-300 hover:text-white bg-white/5"}`}>
                {item.icon} {item.name}
                {item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold px-1">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="col-span-2 sm:col-span-3 pt-2 border-t border-white/10 mt-1">
              {token ? (
                <button onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/20 text-red-400 font-semibold text-sm">
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <Link to="/login"
                  className="w-full flex items-center justify-center py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 font-bold text-sm">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}