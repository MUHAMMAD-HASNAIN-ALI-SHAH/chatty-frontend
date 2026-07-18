import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import type { User } from './authSlice';

export interface Message {
    _id?: string;
    senderId: User;
    receiverId: User;
    chatId: string;
    text?: string;
    image?: string;
    isRead?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const sendMessage = createAsyncThunk(
    "message/sendMessage",
    async (
        { receiverId, chatId, text, image }: { receiverId: string; chatId: string; text?: string; image?: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/v3/message/send-message", {
                receiverId,
                chatId,
                text,
                image
            });

            return response.data;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch chats");
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const getMessages = createAsyncThunk(
    "message/getMessages",
    async (
        selectedChatId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v3/message/get-messages/${selectedChatId}`);
            return response.data;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch chats");
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export interface MessageState {
    messages: Message[];
    getMessagesLoader: boolean;
}

const initialState: MessageState = {
    messages: [],
    getMessagesLoader: false,
}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addNewMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMessages.pending, (state) => {
            state.getMessagesLoader = true;
        });
        builder.addCase(getMessages.fulfilled, (state, action) => {
            state.messages = action.payload.messages;
            state.getMessagesLoader = false;
        });
        builder.addCase(getMessages.rejected, (state) => {
            state.getMessagesLoader = false;
        });
    }
})

export const { addNewMessage } = messageSlice.actions

export default messageSlice.reducer