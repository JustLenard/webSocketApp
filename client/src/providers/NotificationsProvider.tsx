import { PropsWithChildren, useEffect, useState } from 'react'
import AppSpinner from '../components/AppSpinner'
import { useAuth } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { handleError } from '../utils/handleAxiosErrors'
import { showSpinner } from '../utils/helpers'
import { NotificationsContext, NotificationsContextType } from './context/notification.context'

/**
 * Notifications provider for the app
 */
const NotificationsProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { loggedIn } = useAuth()
	const { privateAxios } = useAxiosPrivate()

	const [notifications, setNotifications] = useState([])
	const [loading, setLoading] = useState(true)

	const contextValue: NotificationsContextType = {
		notifications,
	}

	useEffect(() => {
		const getNotification = async () => {
			try {
				setLoading(true)
				const response = await privateAxios.get('notifications')
				if (response.data) setNotifications(response.data)
			} catch (err) {
				handleError(err)
			}
			setLoading(false)
		}
		if (loggedIn) {
			getNotification()
		}
	}, [loggedIn])

	if (showSpinner(loading)) return <AppSpinner text="Getting Notifications" />

	return <NotificationsContext.Provider value={contextValue}>{children}</NotificationsContext.Provider>
}

export default NotificationsProvider
