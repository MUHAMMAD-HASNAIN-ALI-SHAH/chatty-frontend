import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { User } from './authSlice';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import type { Message } from './messageSlice';

export interface Chat {
    _id?: string;
    firstUserId: User;
    secondUserId: User;
    lastMessageId?: Message;
    firstUserUnseenMessagesCount?: number;
    secondUserUnseenMessagesCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export const getChats = createAsyncThunk(
    "chat/getChats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/v2/chat/get-chats");
            return response.data;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch chats");
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const markChatAsRead = createAsyncThunk(
    "message/markMessagesAsRead",
    async (
        { chatId, userId }: { chatId: string; userId: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/v3/message/mark-messages-as-read`, {
                chatId,
                userId
            });
            return response.data;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to mark messages as read");
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export interface ChatState {
    chats: Chat[];
    onlineChats: Chat[] | [];
    selectedChat: Chat | null;
    getChatsLoader: boolean;
}

const initialState: ChatState = {
    chats: [],
    onlineChats: [],
    selectedChat: null,
    getChatsLoader: false,
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineChats = action.payload;
        },
        chatUpdate: (state, action) => {
            const updatedChat = action.payload;
            const chatIndex = state.chats.findIndex(chat => chat._id === updatedChat.chatId);

            if (chatIndex !== -1) {
                if (updatedChat.lastMessageId) {
                    state.chats[chatIndex].lastMessageId = updatedChat.lastMessageId;
                }
                state.chats[chatIndex].firstUserUnseenMessagesCount = updatedChat.firstUserUnseenMessagesCount;
                state.chats[chatIndex].secondUserUnseenMessagesCount = updatedChat.secondUserUnseenMessagesCount;
            }
        },
        updateChatLastMessage: (state, action) => {
            const { chatId, lastMessageId } = action.payload;
            const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
            if (chatIndex !== -1) {
                state.chats[chatIndex].lastMessageId = lastMessageId;
            }
        },
        closeChat: (state) => {
            state.selectedChat = null;
        },
        clearAllChatSlice: (state) => {
            state.chats = [];
            state.onlineChats = [];
            state.selectedChat = null;
            state.getChatsLoader = false;
        },
        addNewChat: (state, action) => {
            state.chats.push(action.payload.chat);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getChats.pending, (state) => {
            state.getChatsLoader = true;
        });
        builder.addCase(getChats.fulfilled, (state, action) => {
            state.chats = action.payload.chats;
            state.getChatsLoader = false;
        });
        builder.addCase(getChats.rejected, (state) => {
            state.getChatsLoader = false;
        });

        builder.addCase(markChatAsRead.fulfilled, (state, action) => {
            const { chatId } = action.payload;
            const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
            if (chatIndex !== -1) {
                state.chats[chatIndex].firstUserUnseenMessagesCount = 0;
                state.chats[chatIndex].secondUserUnseenMessagesCount = 0;
            }
        });
    }
})

export const { setSelectedChat, setOnlineUsers, chatUpdate, updateChatLastMessage, closeChat, clearAllChatSlice, addNewChat } = chatSlice.actions

export default chatSlice.reducer