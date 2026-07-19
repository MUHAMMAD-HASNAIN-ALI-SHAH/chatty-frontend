import { EllipsisVertical } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import type { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { closeChat } from "@/slices/chatStore";
import { clearMessages } from "@/slices/messageSlice";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = ({ setProfileOpen }: { setProfileOpen: (open: boolean) => void }) => {
  const { selectedChat, onlineChats } = useSelector(
    (state: RootState) => state.chat
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const otherUser =
    selectedChat!.firstUserId._id === user!._id
      ? selectedChat!.secondUserId
      : selectedChat!.firstUserId;

  const closeChatandRemoveMessages = () => {
    dispatch(closeChat());
    dispatch(clearMessages());
  }

  return (
    <header className="w-full h-16 sm:h-20 border-b bg-white px-3 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <SidebarTrigger />

        <div className="relative">
          <img
            src={otherUser.profilePic || "/default-profile.webp"}
            alt="Profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border"
          />

          {(onlineChats as string[]).includes(otherUser._id) && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="font-semibold text-sm sm:text-lg truncate">
            {otherUser.username}
          </h2>

          <p className="text-xs sm:text-sm text-green-600">
            {(onlineChats as string[]).includes(otherUser._id)
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>

      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />} className="cursor-pointer rounded-full text-gray-600 hover:bg-gray-100 hover:text-black transition-all duration-200">
            <EllipsisVertical size={22} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setProfileOpen(true)} className="w-full px-4 py-3 text-left cursor-pointer hover:bg-gray-100">View Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => closeChatandRemoveMessages()} className="w-full px-4 py-3 text-left cursor-pointer hover:bg-gray-100">Close Chat</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="w-full px-4 py-3 text-left cursor-pointer hover:bg-gray-100">Block User</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;