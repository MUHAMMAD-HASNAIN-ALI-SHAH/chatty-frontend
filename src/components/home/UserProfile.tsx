import type { RootState } from "@/store";
import { X } from "lucide-react";
import { useSelector } from "react-redux";

type UserProfileProps = {
  profilePic?: string;
  username: string;
  email: string;
  userId: string;
  setProfileOpen: (open: boolean) => void;
};

const UserProfile = ({ profilePic, username, email, userId, setProfileOpen }: UserProfileProps) => {
  const { onlineChats } = useSelector(
    (state: RootState) => state.chat
  );
  const { messages } = useSelector(
    (state: RootState) => state.message
  );

  let getImages = messages.filter((message) => message.image);

  return (
    <div className="relative flex h-screen flex-col items-center justify-center px-6 text-center">

      <div>
        <X className="absolute top-4 right-4 h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setProfileOpen(false)} />

        <img
          src={profilePic || "/default-profile.webp"}
          alt="Profile"
          className="h-32 w-32 sm:h-40 sm:w-40 md:h-52 md:w-52 rounded-full object-cover border-4 border-white shadow-2xl"
        />

        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
          {username}
        </h1>

        <p className="mt-3 text-base sm:text-lg md:text-2xl text-gray-500 break-all">
          {email}
        </p>

        <p className="text-xs sm:text-sm text-green-600">
          {(onlineChats as string[]).includes(userId)
            ? "Online"
            : "Offline"}
        </p>
      </div>
      <div className="mt-8 w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-left font-bold text-lg">Media:</h1>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {
            getImages.length === 0 && (
              <p className="text-slate-500">No media found.</p>
            )
          }
          {
            getImages.map((message) => (
              <img
                key={message._id}
                src={message.image}
                alt="Shared"
                className="h-30 w-24 rounded-lg object-cover select-none"
              />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default UserProfile;