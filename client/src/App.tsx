import { Provider } from 'react-redux'
import Root from './router/Root'
import { store } from './store/store'
import { AuthProvider } from './auth/AuthProvider'

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<AuthProvider>
				<Root />
			</AuthProvider>
		</Provider>
	)
}

export default App
