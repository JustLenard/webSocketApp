import { Provider } from 'react-redux'
import Root from './router/Root'
import { store } from './store/store'
import { AuthProvider } from './context/AuthProvider'
import SocketProvider from './context/SocketProvider'
import UserProvider from './context/UserProvider'

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<AuthProvider>
				<SocketProvider>
					<UserProvider>
						<Root />
					</UserProvider>
				</SocketProvider>
			</AuthProvider>
		</Provider>
	)
}

export default App
