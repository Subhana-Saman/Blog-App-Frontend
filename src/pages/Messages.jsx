import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import API from "../utils/api";
import { Send, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

const POLL_INTERVAL = 5000; // 5 seconds — active chat refresh
const CONV_POLL_INTERVAL = 15000; // conversation list refresh

export default function Messages() {
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const activeChatRef = useRef(null);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    fetchConversations();
    const convInterval = setInterval(fetchConversations, CONV_POLL_INTERVAL);
    return () => clearInterval(convInterval);
  }, []);

  // Poll active conversation for new messages
  useEffect(() => {
    if (!activeChat) return;

    const interval = setInterval(() => {
      fetchMessages(activeChat._id, true);
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [activeChat]);

  // Open chat via ?user=ID param
  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId && userId !== activeChat?._id) {
      openChatWithUser(userId);
    }
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await API.get("/chat/conversations");
      setConversations(data.data || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const openChatWithUser = async (userId) => {
    try {
      const { data } = await API.get(`/users/profile/${userId}`);
      setActiveChat(data.user);
      fetchMessages(userId);
    } catch {
      toast.error("User not found");
    }
  };

  const fetchMessages = async (userId, silent = false) => {
    try {
      const { data } = await API.get(`/chat/${userId}`);
      const newMessages = data.data || [];

      // Only update if message count changed (avoid jitter)
      setMessages((prev) => {
        if (prev.length !== newMessages.length) return newMessages;
        return prev;
      });

      if (!silent) fetchConversations();
    } catch {}
  };

  const sendMessage = async () => {
    if (!text.trim() || !activeChat) return;
    const tempText = text;
    setText("");

    try {
      const { data } = await API.post("/chat/send", {
        receiverId: activeChat._id,
        text: tempText,
      });
      setMessages((prev) => [...prev, data.data]);
    } catch {
      toast.error("Failed to send");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-24 px-2 sm:px-6 pb-6">
      <div className="max-w-6xl mx-auto h-[80vh] flex rounded-3xl border border-white/10 overflow-hidden bg-white/[0.02]">

        {/* CONVERSATIONS LIST */}
        <div className={`w-full sm:w-[320px] border-r border-white/10 flex-col ${activeChat ? "hidden sm:flex" : "flex"}`}>
          <div className="p-5 border-b border-white/10">
            <h2 className="text-xl font-black flex items-center gap-2">
              <MessageCircle className="text-cyan-400" size={22} /> Messages
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-center text-gray-500 mt-10 px-4">
                No conversations yet. Visit an author profile and click "Message".
              </p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.conversationId}
                  onClick={() => {
                    setActiveChat(conv.otherUser);
                    fetchMessages(conv.otherUser._id);
                  }}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition border-b border-white/5 ${
                    activeChat?._id === conv.otherUser._id ? "bg-cyan-500/10" : ""}`}
                >
                  <img src={conv.otherUser?.avatar || "/default.png"} className="w-11 h-11 rounded-full object-cover" />
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="font-semibold text-sm">{conv.otherUser?.username}</p>
                    <p className="text-xs text-gray-400 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-cyan-500 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className={`flex-1 flex-col ${activeChat ? "flex" : "hidden sm:flex"}`}>
          {!activeChat ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <button onClick={() => setActiveChat(null)} className="sm:hidden text-gray-400">←</button>
                <img src={activeChat.avatar || "/default.png"} className="w-10 h-10 rounded-full object-cover" />
                <p className="font-bold">{activeChat.username}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 mt-10">Say hello! 👋</p>
                ) : (
                  messages.map((msg) => {
                    const isMine = (msg.sender?._id || msg.sender) === user._id;
                    return (
                      <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                          isMine ? "bg-cyan-500 text-white rounded-br-sm" : "bg-white/10 text-gray-200 rounded-bl-sm"}`}>
                          {msg.text}
                          <p className={`text-[10px] mt-1 ${isMine ? "text-cyan-100" : "text-gray-500"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <div className="p-4 border-t border-white/10 flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 text-sm"
                />
                <button onClick={sendMessage} className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition">
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}