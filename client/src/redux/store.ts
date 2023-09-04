import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './slices/notifications.slice'

/**
 * Create the store. All reducers go in here
 */

export const store = configureStore({
	reducer: {
		notif: authSlice.reducer,
	},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch