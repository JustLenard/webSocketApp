import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TRoom, SimpleRoomNotifications, NotificationSocketEvent, TNotification } from '../../types/types'

const initialState: Record<number, SimpleRoomNotifications | null> = {}

/**
 * Log In Slice
 */
export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUpNotification: (state, action: PayloadAction<TRoom[]>) => {
			console.log('This is action.payload', action.payload)

			action.payload.forEach((room) => (state[room.id] = room.notifications))
			console.log('This is state', state)
		},
		newNotification: (state, action: PayloadAction<NotificationSocketEvent>) => {
			const { roomId, notif } = action.payload
			if (!state[roomId]) {
				state[roomId] = {
					roomId,
					lastMessage: {
						author: notif.creator,
						messageText: notif.message.text,
						createdAt: notif.message.created_at,
					},
					unreadNotificationsAmount: 0,
				}
			} else {
				state[roomId] = {
					roomId,
					lastMessage: {
						author: notif.creator,
						messageText: notif.message.text,
						createdAt: notif.message.created_at,
					},
					unreadNotificationsAmount: state[roomId] ? state[roomId]!.unreadNotificationsAmount + 1 : 0,
				}
			}
		},
	},
})

// const notifToSimplenotif = (notif: TNotification): SimpleRoomNotifications => {}

// Action creators are generated for each case reducer function
export const { setUpNotification, newNotification } = authSlice.actions

export default authSlice.reducer
