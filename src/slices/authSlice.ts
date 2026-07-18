import axiosInstance from '@/lib/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

export interface User {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
}

export const register = createAsyncThunk(
    "auth/register",
    async (
        formData: {
            username: string;
            email: string;
            password: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.post(
                "/api/v1/auth/register",
                formData
            );

            toast.success("Successfully registered");

            return response.data;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Signup failed");
            return rejectWithValue(error?.response?.data?.message);
        }
    }
)

export const login = createAsyncThunk(
    "auth/login",
    async (
        formData: {
            email: string;
            password: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.post(
                "/api/v1/auth/login",
                formData
            );
            return response.data;
        }
        catch (error: any) {
            toast.error(error?.response?.data?.message || "Login failed");
            return rejectWithValue(error?.response?.data?.message);
        }
    }
)

export const verifyToken = createAsyncThunk(
    "auth/verifyToken",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/v1/auth/verify");
            return response.data;
        }
        catch (error: any) {
            toast.error(error?.response?.data?.message || "Token verification failed");
            return rejectWithValue(error?.response?.data?.message);
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.get("/api/v1/auth/logout");
            toast.success("Successfully logged out");
        }
        catch (error: any) {
            toast.error(error?.response?.data?.message || "Logout failed");
            return rejectWithValue(error?.response?.data?.message);
        }
    }
)

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    authButtonLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isAuthenticating: true,
    authButtonLoading: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.authButtonLoading = true;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.authButtonLoading = false;
            state.user = action.payload;
        });
        builder.addCase(register.rejected, (state) => {
            state.authButtonLoading = false;
        });

        builder.addCase(login.pending, (state) => {
            state.authButtonLoading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.authButtonLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        });
        builder.addCase(login.rejected, (state) => {
            state.authButtonLoading = false;
        });

        builder.addCase(verifyToken.pending, (state) => {
            state.isAuthenticating = true;
        });
        builder.addCase(verifyToken.fulfilled, (state, action) => {
            state.isAuthenticating = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        });
        builder.addCase(verifyToken.rejected, (state) => {
            state.isAuthenticating = false;
            state.user = null;
            state.isAuthenticated = false;
        });

        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
        });
    }
})

export const { } = authSlice.actions

export default authSlice.reducer