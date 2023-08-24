import { createContext } from 'react'
import { NotificationT } from '../../types/types'

export type NotificationsContextType = {
	notifications: NotificationT[]
	markRoomNotificationsAsRead: (roomId: number) => void
}

export const NotificationsContext = createContext<NotificationsContextType>({
	notifications: [],
	markRoomNotificationsAsRead: () => {},
})
