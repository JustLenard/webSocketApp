import { PropsWithChildren } from 'react'
import { AuthProvider } from './AuthProvider'
import RoomsProvider from './RoomsProvider'
import SocketProvider from './SocketProvider'
import UserProvider from './UserProvider'
import NotificationsProvider from './NotificationsProvider'

const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<AuthProvider>
			<SocketProvider>
				<UserProvider>
					<RoomsProvider>
						{/* <NotificationsProvider> */}
						{children}
						{/* </NotificationsProvider> */}
					</RoomsProvider>
				</UserProvider>
			</SocketProvider>
		</AuthProvider>
	)
}

export default AppProviders
