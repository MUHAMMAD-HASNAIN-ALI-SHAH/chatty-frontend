import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { User } from './authSlice';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';

export interface Chat {
    _id?: string;
    firstUserId: User;
    secondUserId: User;
    isBlocked?: boolean;
    lastMessageTime?: Date;
    lastMessage?: string;
    unseenMessagesCount?: number;
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
    }
})

export const { setSelectedChat, setOnlineUsers } = chatSlice.actions

export default chatSlice.reducer