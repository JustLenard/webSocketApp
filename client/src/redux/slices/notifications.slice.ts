import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { SimpleRoomNotifications, TCreateNewnotification, TRoom } from '../../types/types'

const initialState: Record<number, SimpleRoomNotifications> = {}

/**
 * Notifications Slice
 */
export const notifSlice = createSlice({
	name: 'notifications',
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
		newNotification: (state, action: PayloadAction<TCreateNewnotification>) => {
			const { roomId, notif, incrementNotifCount } = action.payload
			state[roomId] = {
				lastMessage: notif.message,
				unreadNotificationsAmount: incrementNotifCount
					? state[roomId].unreadNotificationsAmount + 1
					: state[roomId].unreadNotificationsAmount,
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
export const { addNewRoom, markRoomNotifAsRead, setUpNotification, newNotification } = notifSlice.actions

export default notifSlice.reducer
