import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addNotification } from "../features/notifications/notificationSlice";

export const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) return;

    const socket = io("/", {
      auth: { token },
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("newNotification", (notification) => {
      dispatch(addNotification(notification));
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => socket.disconnect();
  }, [dispatch]);

  return socketRef.current;
};
