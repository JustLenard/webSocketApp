import { createContext } from 'react'
import { NotificationT } from '../../types/types'

export type NotificationsContextType = {
	notifications: NotificationT[]
}

export const NotificationsContext = createContext<NotificationsContextType>({
	notifications: [],
})
