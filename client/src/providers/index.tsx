import { PropsWithChildren } from 'react'
import { AuthProvider } from './AuthProvider'
import RoomsProvider from './RoomsProvider'
import SocketProvider from './SocketProvider'
import UserProvider from './UserProvider'
import NotificationsProvider from './NotificationsProvider'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<AuthProvider>
			<SocketProvider>
				<UserProvider>
					<Provider store={store}>
						<RoomsProvider>
							{/* <NotificationsProvider> */}

							{children}

							{/* </NotificationsProvider> */}
						</RoomsProvider>
					</Provider>
				</UserProvider>
			</SocketProvider>
		</AuthProvider>
	)
}

export default AppProviders
