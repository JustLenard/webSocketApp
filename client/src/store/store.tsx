import { configureStore } from '@reduxjs/toolkit'

/**
 * Create the store. All reducers go in here
 */
export const store = configureStore({
	reducer: {},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
