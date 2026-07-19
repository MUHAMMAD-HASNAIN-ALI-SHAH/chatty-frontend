import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axios";
import { getChats } from "@/slices/chatStore";
import type { AppDispatch } from "@/store";
import { Loader2, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const AddNewUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const findChat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) return;

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        "/api/v2/chat/find-user",
        { username }
      );

      setUser(response.data.user);
    } catch (error: any) {
      setUser(null);
      toast.error(
        error?.response?.data?.message || "Failed to find user"
      );
    } finally {
      setLoading(false);
    }
  };

  const addChat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      setLoading(true);

      await axiosInstance.post(
        "/api/v2/chat/add-chat",
        { receiverId: user._id }
      );

      toast.success("Chat added successfully");
      setOpen(false);

      dispatch(getChats());
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to add chat"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="w-full p-4 py-2">
        <DialogTrigger className="w-full rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-4 py-3 font-medium text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg">
          <span className="flex items-center justify-center gap-2">
            <UserPlus size={18} />
            Add New User
          </span>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Start a New Chat
          </DialogTitle>

          <DialogDescription>
            Search for a user by username and start chatting instantly.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={findChat}
          className="mt-4 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl cursor-pointer bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </form>

        {user && (
          <div className="mt-6 rounded-2xl border bg-slate-50 p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={
                  user.profilePicture ||
                  `https://ui-avatars.com/api/?name=${user.username}`
                }
                alt={user.username}
                className="h-14 w-14 rounded-full object-cover border"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">
                  {user.username}
                </h3>

                <p className="text-sm text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={addChat}
              className="mt-4 cursor-pointer w-full flex items-center justify-center rounded-xl bg-green-600 py-3 font-medium text-white transition hover:bg-green-700"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Start Chat"
              )}
            </button>
            <p className="mt-2 text-center text-sm text-slate-500">
              After this you can start chatting with this user.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddNewUser;