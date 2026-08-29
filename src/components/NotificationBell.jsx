import { Bell, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import API from "../utils/api";

const POLL_INTERVAL = 15000; // 15 seconds

export default function NotificationBell() {
  const { token } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!token) return;
    fetchNotifications();

    const interval = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get("/notifications");
      setNotifications(data.notifications || []);
      setUnread(data.unreadCount || 0);
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error("Notifications error:", err.message);
      }
    }
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setUnread(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((p) => !p)} className="relative p-2 rounded-xl hover:bg-white/10 transition">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[320px] bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-white">Notifications</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-cyan-400 hover:underline">
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-500">No notifications yet</p>
            ) : (
              notifications.slice(0, 15).map((n, i) => (
                <div key={n._id || i} className={`p-4 hover:bg-white/5 transition ${!n.isRead ? "bg-cyan-500/5 border-l-2 border-cyan-500" : ""}`}>
                  <p className="text-sm text-gray-200">{n.message}</p>
                  {n.fromUser?.username && (
                    <p className="text-xs text-gray-500 mt-1">by {n.fromUser.username}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}