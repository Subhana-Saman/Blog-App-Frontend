import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PenSquare, Shield, User, Menu, X } from "lucide-react";

const navLinks = [
  { to: "/dashboard",   icon: <LayoutDashboard size={18} />, label: "Overview" },
  { to: "/create-blog", icon: <PenSquare size={18} />,       label: "Create Blog" },
  { to: "/admin",       icon: <Shield size={18} />,           label: "Admin" },
  { to: "/profile",     icon: <User size={18} />,             label: "Profile" },
];

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 h-full w-[240px] z-30
        bg-[#0a0f1e] border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-cyan-400">DevVerse</h1>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4 mt-2">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                location.pathname === item.to
                  ? "bg-cyan-500/20 text-white border border-cyan-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* MOBILE TOP BAR */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-4 border-b border-white/10 bg-[#0a0f1e]">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 transition"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-cyan-400">DevVerse</span>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}