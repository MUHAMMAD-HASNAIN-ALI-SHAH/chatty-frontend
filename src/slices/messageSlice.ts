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

export const deleteMessage = createAsyncThunk(
    "message/deleteMessage",
    async (
        messageId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/api/v3/message/delete-message/${messageId}`);
            return response.data.messageId;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch chats");
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export interface MessageState {
    messages: Message[];
    getMessagesLoader: boolean;
    sendMessageLoader: boolean;
    deleteMessageLoader: boolean;
}

const initialState: MessageState = {
    messages: [],
    getMessagesLoader: false,
    sendMessageLoader: false,
    deleteMessageLoader: false,
}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addNewMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setAllChatMessagesAsRead: (state, action) => {
            const { chatId } = action.payload;
            state.messages = state.messages.map((message) => {
                if (message.chatId === chatId) {
                    return { ...message, isRead: true };
                }
                return message;
            });
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        deleteMessageWithIdIfExists: (state, action) => {
            const messageIdToDelete = action.payload;
            state.messages = state.messages.filter((message) => message._id !== messageIdToDelete);
        }
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

        builder.addCase(sendMessage.pending, (state) => {
            state.sendMessageLoader = true;
        });
        builder.addCase(sendMessage.fulfilled, (state) => {
            state.sendMessageLoader = false;
        });
        builder.addCase(sendMessage.rejected, (state) => {
            state.sendMessageLoader = false;
        });

        builder.addCase(deleteMessage.pending, (state) => {
            state.deleteMessageLoader = true;
        });
        builder.addCase(deleteMessage.fulfilled, (state, action) => {
            state.messages = state.messages.filter((message) => message._id !== action.payload);
            state.deleteMessageLoader = false;
        });
        builder.addCase(deleteMessage.rejected, (state) => {
            state.deleteMessageLoader = false;
        });
    },
});

export const { addNewMessage, setAllChatMessagesAsRead, clearMessages, deleteMessageWithIdIfExists } = messageSlice.actions

export default messageSlice.reducer