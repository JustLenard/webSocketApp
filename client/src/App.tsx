import { Provider } from 'react-redux'
import Root from './router/Root'
import { store } from './store/store'
import { AuthProvider } from './auth/AuthProvider'
import SocketProvider from './websocket/SocketProvider'

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<AuthProvider>
				<SocketProvider>
					<Root />
				</SocketProvider>
			</AuthProvider>
		</Provider>
	)
}

export default App
