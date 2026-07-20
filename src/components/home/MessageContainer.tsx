import { useEffect, useRef } from "react";
import NoChatSelected from "./NoChatSelected";
import type { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewMessage,
  deleteMessage,
  deleteMessageWithIdIfExists,
  setAllChatMessagesAsRead,
  type Message,
} from "@/slices/messageSlice";
import { socket } from "@/lib/socket";
import { EllipsisVertical, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import { updateChatLastMessage } from "@/slices/chatStore";

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, getMessagesLoader } = useSelector(
    (state: RootState) => state.message
  );
  const { chats } = useSelector(
    (state: RootState) => state.chat
  );
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
      socket?.off("messagesRead", handleChatUpdate);
    };
  }, [dispatch, selectedChat]);

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
      socket?.off("newMessage", handleNewMessage);
    };
  }, [selectedChat, dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: any) => {
      dispatch(deleteMessageWithIdIfExists(data.messageId));
    };
    ``
    socket.on("delete-message", handleNewMessage);

    return () => {
      socket?.off("delete-message", handleNewMessage);
    };
  }, [selectedChat, dispatch]);

  const deleteMessageWithId = (messageId: string) => {
    dispatch(deleteMessage(messageId)).then(() => {
      // check if last message deleted then update last message in chat
      const chat = chats.find((chat) => chat._id === selectedChat?._id);
      if (chat && chat?.lastMessageId?._id === messageId) {
        let secondlastMessage = messages[messages.length - 2];
        dispatch(updateChatLastMessage({ chatId: chat._id, lastMessageId: secondlastMessage }));
      }
    });
  }

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
          {!getMessagesLoader && messages.length === 0 && (
            <div className="flex justify-center items-center h-full text-slate-500">
              No messages yet. Start the conversation!
            </div>
          )}

          {getMessagesLoader && (
            <div className="w-full h-screen flex justify-center items-center">
              <Loader2 className="animate-spin text-blue-600 size-10" />
            </div>
          )}

          {messages.length > 0 &&
            messages.map((message) => {
              const isSender = message.senderId._id === user!._id;

              return (
                <div
                  key={message._id}
                  className={`group flex items-end gap-3 ${isSender ? "justify-end" : "justify-start"
                    }`}
                >
                  {!isSender && (
                    <img
                      src={
                        message.senderId.profilePic ||
                        "/default-profile.webp"
                      }
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover border select-none"
                    />
                  )}

                  {isSender && (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="outline" />} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full p-1.5 hover:bg-gray-200 text-gray-500 cursor-pointer mb-5
                      "
                        >
                          <EllipsisVertical size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => deleteMessageWithId(message._id || '')} className="w-full px-4 py-3 text-left cursor-pointer hover:bg-gray-100 whitespace-nowrap">Delete form everyone</DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* <button
                        className="
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                      duration-200
                      rounded-full
                      p-1.5
                      hover:bg-gray-200
                      text-gray-500
                      cursor-pointer
                      mb-5
                      "
                      >
                        <EllipsisVertical size={18} />
                      </button> */}
                    </>
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
                          className="rounded-lg mb-2 max-h-60 w-full object-cover select-none"
                        />
                      )}

                      {message.text && (
                        <p className="text-sm sm:text-base wrap-break-word">
                          {message.text}
                        </p>
                      )}
                    </div>

                    <div
                      className={`mt-1 flex justify-end gap-3 select-none text-xs text-slate-500 ${isSender ? "text-right" : "text-left"
                        }`}
                    >
                      <p>
                        {message.createdAt
                          ? new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : ""}
                      </p>

                      {isSender && (
                        <p>{message.isRead ? "Read" : "Sent"}</p>
                      )}
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