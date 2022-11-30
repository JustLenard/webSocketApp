import { configureStore } from '@reduxjs/toolkit'
import socketReducer from './socketSlice'

export const store = configureStore({
	reducer: {
		socketReducer,
	},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
