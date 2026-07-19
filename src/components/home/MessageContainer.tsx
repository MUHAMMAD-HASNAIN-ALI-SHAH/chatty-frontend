import { useEffect, useRef } from "react";
import NoChatSelected from "./NoChatSelected";
import type { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { addNewMessage, setAllChatMessagesAsRead, type Message } from "@/slices/messageSlice";
import { socket } from "@/lib/socket";
import { Loader2 } from "lucide-react";
import { IoCheckmarkDone } from "react-icons/io5";

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, getMessagesLoader } = useSelector((state: RootState) => state.message);
  const { user } = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
      if (!socket) return;
  
      const handleChatUpdate = (data: any) => {
        dispatch(setAllChatMessagesAsRead({ chatId: data.chatId }));
      };
  
      socket.on("messagesRead", handleChatUpdate);
  
      return () => {
        socket!.off("messagesRead", handleChatUpdate);
      };
    }, [dispatch, selectedChat]);

  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        console.log("Message seen");
      }
    });

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (selectedChat?._id === message.chatId) {
        dispatch(addNewMessage(message));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket!.off("newMessage", handleNewMessage);
    };
  }, [selectedChat, dispatch]);

  return (
    <div
      className={`h-full w-full ${selectedChat ? "" : "flex justify-center items-center"
        }`}
    >
      {selectedChat ? (
        <div
          ref={scrollRef}
          className="flex flex-col h-full overflow-y-auto p-4 space-y-6 bg-slate-50"
        >
          {
            messages.length === 0 && (
              <div className="flex justify-center items-center h-full text-slate-500">
                No messages yet. Start the conversation!
              </div>
            )
          }
          {
            getMessagesLoader && (
              <div className="w-full h-screen flex justify-center items-center">
                <Loader2 className="animate-spin text-blue-600 size-10" />
              </div>
            )
          }
          {messages.length > 0 && messages.map((message, index) => {
            const isSender = message.senderId._id === user!._id;

            return (
              <div
                key={message._id}
                ref={index === messages.length - 1 ? messageRef : null}
                className={`flex items-end gap-3 ${isSender ? "justify-end" : "justify-start"
                  }`}
              >
                {!isSender && (
                  <img
                    src={message.senderId.profilePic || "/default-profile.webp"}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border select-none"
                  />
                )}

                <div className="max-w-[75%] sm:max-w-md">
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${isSender
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white text-slate-800 border rounded-bl-md"
                      }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Shared"
                        className="rounded-lg mb-2 max-h-60 w-full object-cover"
                      />
                    )}

                    {message.text && (
                      <p className="text-sm sm:text-base wrap-break-word">
                        {message.text}
                      </p>
                    )}
                  </div>

                  <div
                    className={`mt-1 flex gap-3 select-none text-xs text-slate-500 ${isSender ? "text-right" : "text-left"
                      }`}
                  >
                    <p>{message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</p> {isSender && <IoCheckmarkDone
                      size={18}
                      className={message.isRead ? "text-blue-800" : ""}
                    />}
                  </div>
                </div>

                {isSender && (
                  <img
                    src={user?.profilePic || "/default-profile.webp"}
                    alt="Me"
                    className="w-10 h-10 select-none rounded-full object-cover border"
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
};

export default MessageContainer;