import { useSelector } from "react-redux";
import Header from "./Header";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import type { RootState } from "@/store";
import NoChatSelected from "./NoChatSelected";

const Main = () => {
  const { selectedChat } = useSelector((state: RootState) => state.chat);
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