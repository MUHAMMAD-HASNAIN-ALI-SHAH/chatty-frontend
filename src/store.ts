import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './slices/authSlice'
import { chatSlice } from './slices/chatStore'
import { messageSlice } from './slices/messageSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    chat: chatSlice.reducer,
    message: messageSlice.reducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch