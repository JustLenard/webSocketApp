import { AuthProvider } from './providers/AuthProvider'
import SocketProvider from './providers/SocketProvider'
import UserProvider from './providers/UserProvider'
import Root from './router/Root'

const App: React.FC = () => {
	return (
		<AuthProvider>
			<SocketProvider>
				<UserProvider>
					<Root />
				</UserProvider>
			</SocketProvider>
		</AuthProvider>
	)
}

export default App
