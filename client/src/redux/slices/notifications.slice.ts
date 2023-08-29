import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TRoom, SimpleRoomNotifications, NotificationSocketEvent, TNotification } from '../../types/types'

const initialState: Record<number, SimpleRoomNotifications> = {}

/**
 * Log In Slice
 */
export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUpNotification: (state, action: PayloadAction<TRoom[]>) => {
			action.payload.forEach(
				(room) =>
					(state[room.id] = {
						unreadNotificationsAmount: room.notifications,
						lastMessage: room.lastMessage ? room.lastMessage : null,
					}),
			)
		},
		newNotification: (state, action: PayloadAction<NotificationSocketEvent>) => {
			const { roomId, notif } = action.payload
			if (!state[roomId]) {
				state[roomId] = {
					lastMessage: notif.message,
					unreadNotificationsAmount: 0,
				}
			} else {
				state[roomId] = {
					lastMessage: notif.message,
					unreadNotificationsAmount: state[roomId].unreadNotificationsAmount + 1,
				}
			}
		},
		markRoomNotifAsRead: (state, action: PayloadAction<number>) => {
			const roomNotif = state[action.payload]
			if (roomNotif) {
				roomNotif.unreadNotificationsAmount = 0
			}
		},
		addNewRoom: (state, action: PayloadAction<TRoom>) => {
			state[action.payload.id] = {
				lastMessage: action.payload.lastMessage ? action.payload.lastMessage : null,
				unreadNotificationsAmount: 0,
			}
		},
	},
})

// Action creators are generated for each case reducer function
export const { addNewRoom, markRoomNotifAsRead, setUpNotification, newNotification } = authSlice.actions

export default authSlice.reducer
