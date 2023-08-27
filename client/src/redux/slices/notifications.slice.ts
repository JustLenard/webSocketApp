import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RoomI, SimpleRoomNotifications } from '../../types/types'

// const initialState
// const initialState: string[] = []

/**
 * Log In Slice
 */
export const authSlice = createSlice({
	name: 'auth',
	initialState: new Map<number, SimpleRoomNotifications | null>(),
	reducers: {
		setUpNotification: (state, action: PayloadAction<RoomI[]>) => {
			console.log('This is action.payload', action.payload)

			// action.payload.forEach((room) => state.set(room.id, room.notifications))
			// console.log('This is state', state)
		},
	},
})

// Action creators are generated for each case reducer function
export const { setUpNotification } = authSlice.actions

export default authSlice.reducer
