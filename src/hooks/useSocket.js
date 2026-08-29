import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function useSocket(setNotifications) {
  useEffect(() => {

    // 🔔 LIVE NOTIFICATIONS RECEIVE
    socket.on("receiveNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("receiveNotification");
    };

  }, [setNotifications]);

  return socket;
}