import { configureStore } from '@reduxjs/toolkit'
import { notifSlice } from './slices/notifications.slice'
import { drawerSlice } from './slices/drawer.slice'
import { modalsSlice } from './slices/modalStates.slice'

/**
 * Create the store. All reducers go in here
 */
export const store = configureStore({
	reducer: {
		notif: notifSlice.reducer,
		drawer: drawerSlice.reducer,
		modals: modalsSlice.reducer,
	},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
