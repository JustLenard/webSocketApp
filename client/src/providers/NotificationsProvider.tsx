import { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { NotificationsContext, NotificationsContextType } from './context/notification.context'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { handleError } from '../utils/handleAxiosErrors'
import { useAuth, useUser } from '../hooks/contextHooks'

/**
 * Notifications provider for the app
 */
const NotificationsProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { loggedIn } = useAuth()
	const [notifications, setNotifications] = useState([])
	const { privateAxios } = useAxiosPrivate()

	const contextValue: NotificationsContextType = {
		notifications,
	}

	useEffect(() => {
		const getNotification = async () => {
			try {
				const response = await privateAxios.get('notifications')
				console.log('Those are notifications ', response.data)
				if (response.data) setNotifications(response.data)
			} catch (err) {
				handleError(err)
			}
		}
		if (loggedIn) {
			getNotification()
		}
	}, [loggedIn])

	useEffect(() => {}, [])

	return <NotificationsContext.Provider value={contextValue}>{children}</NotificationsContext.Provider>
}

export default NotificationsProvider
