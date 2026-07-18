import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full h-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 px-6 sm:px-8 md:px-12">
      <div className="max-w-md text-center space-y-5 md:space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-blue-100 flex items-center justify-center shadow-sm animate-bounce">
            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Welcome to Chatty
          </h2>

          <p className="text-sm sm:text-base text-slate-500">
            Select a conversation from the sidebar to start chatting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;