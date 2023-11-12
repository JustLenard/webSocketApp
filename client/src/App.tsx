import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppProviders from './providers'
import Root from './router/Root'

const App: React.FC = () => {
	return (
		<AppProviders>
			<Root />
			<ToastContainer />
		</AppProviders>
	)
}

export default App
