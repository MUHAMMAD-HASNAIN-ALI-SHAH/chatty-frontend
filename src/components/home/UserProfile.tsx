import { X } from "lucide-react";

type UserProfileProps = {
  profilePic?: string;
  username: string;
  email: string;
  setProfileOpen: (open: boolean) => void;
};

const UserProfile = ({ profilePic, username, email, setProfileOpen }: UserProfileProps) => {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center px-6 text-center">

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
    </div>
  );
};

export default UserProfile;