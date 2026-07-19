import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Loader2, LogOut, Search, User } from "lucide-react";
import { logout } from "@/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import AddNewUser from "./AddNewUser";
import { markChatAsRead, setSelectedChat, type Chat } from "@/slices/chatStore";
import { disconnectSocket } from "@/lib/socket";
import { clearMessages, getMessages } from "@/slices/messageSlice";

export function AppSidebar() {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { chats, selectedChat, onlineChats, getChatsLoader } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);

  let sortedChatsBasedonLastMessageTime = [...chats].sort((a, b) => {
    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
    return timeB - timeA;
  });

  let sortedChats = [...sortedChatsBasedonLastMessageTime]

  return (
    <Sidebar className="h-screen">
      <SidebarHeader className="border-b p-4">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-full items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg">
            Chatty
          </div>
        </div>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-lg border px-10 py-2 outline-none focus:border-blue-500"
          />
        </div>
      </SidebarHeader>

      <AddNewUser />

      <SidebarContent className="overflow-y-auto">
        <div className="flex flex-col py-2">
          {
            getChatsLoader && (
              <div className="w-full mt-2 flex justify-center items-center">
                <Loader2 className="animate-spin text-blue-600 size-6" />
              </div>
            )
          }
          {
            !getChatsLoader && chats.length === 0 && (
              <div className="w-full h-screen flex justify-center items-center">
                <p className="text-slate-500">No chats found.</p>
              </div>
            )
          }
          {sortedChats && sortedChats.map((chat: Chat) => {
            const otherUser =
              chat.firstUserId._id === user!._id
                ? chat.secondUserId
                : chat.firstUserId;

            const whichUserUnseenMessagesCount =
              chat.firstUserId._id === user!._id
                ? chat.firstUserUnseenMessagesCount
                : chat.secondUserUnseenMessagesCount;

            return (
              <div
                key={chat._id}
                className={`relative flex items-center gap-3 mx-2 my-1 px-2 py-2 rounded-md text-left transition-colors select-none cursor-pointer ${chat._id === selectedChat?._id
                  ? "bg-blue-200"
                  : "hover:bg-gray-200"
                  }`}
                onClick={() => {
                  if (chat._id === selectedChat?._id) return;
                  dispatch(clearMessages());
                  dispatch(setSelectedChat(chat));
                  dispatch(getMessages(chat._id!));
                  dispatch(markChatAsRead({ chatId: chat._id!, userId: user!._id }));
                }}
              >
                {
                  (whichUserUnseenMessagesCount ?? 0) > 0 && (
                    <div className="absolute right-2 bottom-0 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-green-500 text-[10px] font-semibold text-white ring-2 ring-white">
                      <span>{whichUserUnseenMessagesCount}</span>
                    </div>
                  )
                }
                <div className="relative">
                  <img
                    src={otherUser.profilePic || "/default-profile.webp"}
                    alt={otherUser.username}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  {
                    (onlineChats as string[]).includes(otherUser._id) && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                    )
                  }
                </div>

                <p className="absolute right-3 top-2">
                  {chat.lastMessageTime && (
                    <span className="text-xs">
                      {(() => {
                        const messageDate = new Date(chat.lastMessageTime);
                        const now = new Date();

                        const isToday =
                          messageDate.getDate() === now.getDate() &&
                          messageDate.getMonth() === now.getMonth() &&
                          messageDate.getFullYear() === now.getFullYear();

                        return isToday
                          ? messageDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : messageDate.toLocaleDateString();
                      })()}
                    </span>
                  )}
                </p>

                <div className="min-w-0">
                  <h3 className="truncate font-medium">
                    {otherUser.username}
                  </h3>

                  <p className="truncate text-xs text-slate-500">
                    {chat.lastMessage || "No messages yet."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </SidebarContent>

      <SidebarFooter className="relative border-t p-4">
        {showMenu && (
          <div className="absolute bottom-20 left-4 right-4 z-50 overflow-hidden rounded-xl border bg-white shadow-xl">
            <button
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-100"
              onClick={() => {
                setShowMenu(false);
              }}
            >
              <User size={18} />
              <span>Profile</span>
            </button>

            <div className="border-t" />

            <button
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
              onClick={() => {
                dispatch(logout()); disconnectSocket();
                setShowMenu(false);
              }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-100"
        >
          <img
            src={user?.profilePic || "/default-profile.webp"}
            alt={user?.username}
            className="h-12 w-12 rounded-full object-cover"
          />

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">
              {user?.username}
            </h3>

            <p className="truncate text-xs text-slate-500">
              {user?.email}
            </p>
          </div>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}