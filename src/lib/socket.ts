import { setOnlineUsers } from "@/slices/chatStore";
import { store } from "@/store";
import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL;

export let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (socket) return;

  socket = io(BASE_URL, {
    query: {
      userId,
    },
  });

  socket.on("online-users", (users) => {
    store.dispatch(setOnlineUsers(users));
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};