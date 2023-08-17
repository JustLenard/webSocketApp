import { PropsWithChildren } from 'react'
import { AuthProvider } from './AuthProvider'
import MessagesProvider from './MessagesProvider'
import RoomsProvider from './RoomsProvider'
import SocketProvider from './SocketProvider'
import UserProvider from './UserProvider'
import NotificationsProvider from './NotificationsProvider'

const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<AuthProvider>
			<SocketProvider>
				<RoomsProvider>
					<UserProvider>
						<NotificationsProvider>
							<MessagesProvider>{children}</MessagesProvider>
						</NotificationsProvider>
					</UserProvider>
				</RoomsProvider>
			</SocketProvider>
		</AuthProvider>
	)
}

export default AppProviders
