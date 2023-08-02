import { PropsWithChildren } from 'react'
import { AuthProvider } from './AuthProvider'
import MessagesProvider from './MessagesProvider'
import RoomsProvider from './RoomsProvider'
import SocketProvider from './SocketProvider'
import UserProvider from './UserProvider'

const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<AuthProvider>
			<SocketProvider>
				<UserProvider>
					<RoomsProvider>
						<MessagesProvider>{children}</MessagesProvider>
					</RoomsProvider>
				</UserProvider>
			</SocketProvider>
		</AuthProvider>
	)
}

export default AppProviders
