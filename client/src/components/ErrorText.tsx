import Typography from '@mui/joy/Typography'
import { PropsWithChildren } from 'react'

export const ErrorText: React.FC<PropsWithChildren> = ({ children }) => (
	<Typography color="danger" fontSize="sm" my={'.5rem'}>
		{children}
	</Typography>
)
