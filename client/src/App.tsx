import { Box } from '@mui/material'
import AppProviders from './providers'
import Root from './router/Root'

const App: React.FC = () => {
	return (
		<AppProviders>
			<Root />

			{/* <>
				<Box
					sx={{
						border: '2px solid red',
						height: '300px',
						width: '500px',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Box
						sx={{
							border: '2px solid blue',
							height: '200px',
							width: '200px',
							// display: 'inline-block',
						}}
					></Box>
					<Box
						sx={{
							border: '2px solid yellow',
							height: '200px',
							width: '200px',
							// display: 'inline-block',
						}}
					></Box>
				</Box>
			</> */}
		</AppProviders>
	)
}

export default App
