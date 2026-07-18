import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import type { AppDispatch, RootState } from "@/store";
import NoChatSelected from "./NoChatSelected";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { chatUpdate, markChatAsRead, updateChatLastMessage } from "@/slices/chatStore";

const Main = () => {
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!socket) return;

    const handleChatUpdate = (data: any) => {
      if (!selectedChat || selectedChat._id !== data.chatId) {
        dispatch(chatUpdate(data));
      }
      if (selectedChat && selectedChat._id === data.chatId) {
        dispatch(markChatAsRead({ chatId: data.chatId, userId: user!._id }));
      }
      dispatch(updateChatLastMessage({ chatId: data.chatId, lastMessage: data.lastMessage, lastMessageTime: data.lastMessageTime }));
    };

    socket.on("chatUpdate", handleChatUpdate);

    return () => {
      socket!.off("chatUpdate", handleChatUpdate);
    };
  }, [dispatch, selectedChat]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {
        selectedChat && (
          <>
            <Header />
            <div className="h-full overflow-y-auto custom-scrollbar p-1 pt-2 bg-slate-50">
              <MessageContainer />
            </div>
            <MessageInput />
          </>
        )
      }

      {
        !selectedChat && (
          <NoChatSelected />
        )
      }
    </div>
  );
};

export default Main;