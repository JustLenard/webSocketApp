import { createContext } from 'react'
import { TNotification } from '../../types/types'

export type NotificationsContextType = {
	notifications: TNotification[]
	markRoomNotificationsAsRead: (roomId: number) => void
}

export const NotificationsContext = createContext<NotificationsContextType>({
	notifications: [],
	markRoomNotificationsAsRead: () => {},
})
