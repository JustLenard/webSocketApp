import { Box } from '@mui/material'
import AppProviders from './providers'
import Root from './router/Root'

const App: React.FC = () => {
	return (
		<AppProviders>
			<Root />
		</AppProviders>
	)
}

export default App
