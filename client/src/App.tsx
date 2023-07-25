import { Provider } from 'react-redux'
import Root from './router/Root'
import { AuthProvider } from './context/AuthProvider'
import SocketProvider from './context/SocketProvider'
import UserProvider from './context/UserProvider'

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
