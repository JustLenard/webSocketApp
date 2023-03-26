import { Provider } from 'react-redux'
import Root from './router/Root'
import { store } from './store/store'

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<Root />
		</Provider>
	)
}

export default App
