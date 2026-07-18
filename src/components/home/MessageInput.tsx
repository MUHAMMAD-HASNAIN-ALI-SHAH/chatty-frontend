import { updateChatLastMessage } from "@/slices/chatStore";
import { addNewMessage, sendMessage } from "@/slices/messageSlice";
import type { AppDispatch, RootState } from "@/store";
import { FileImage, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const receiverId =
    selectedChat!.firstUserId._id === user!._id
      ? selectedChat!.secondUserId._id
      : selectedChat!.firstUserId._id;
  const chatId = selectedChat!._id!;

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImageBase64(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && !imageBase64) return;

    setMessage("");
    setImageBase64("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    dispatch(sendMessage({ receiverId, chatId, text: message, image: imageBase64 })).then((res) => {
      dispatch(addNewMessage(res.payload));
      dispatch(updateChatLastMessage({ chatId, lastMessage: res.payload.text, lastMessageTime: res.payload.createdAt }));
      console.log(res.payload);
    })
  };

  const removeImage = () => {
    setImageBase64("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full border-t bg-white p-3">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2"
      >
        {imageBase64 && (
          <div className="absolute bottom-16 left-0 flex items-center gap-3 rounded-xl border bg-white p-2 shadow-lg">
            <img
              src={imageBase64}
              alt="Preview"
              className="h-16 w-16 rounded-lg object-cover"
            />

            <button
              type="button"
              onClick={removeImage}
              className="rounded-full p-1 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          id="image-upload"
          onChange={handleImageChange}
          className="hidden"
        />

        <label
          htmlFor="image-upload"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-300 hover:bg-slate-100 transition"
        >
          <FileImage size={20} />
        </label>

        <button
          type="submit"
          disabled={!message.trim() && !imageBase64}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 transition"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;