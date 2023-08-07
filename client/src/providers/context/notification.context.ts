import { createContext } from 'react'
import { Notification } from '../../types/types'

export type NotificationsContextType = {
	notifications: Notification[]
}

export const NotificationsContext = createContext<NotificationsContextType>({
	notifications: [],
})
