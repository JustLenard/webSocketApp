import Typography from '@mui/joy/Typography'
import { ReactNode } from 'react'

export const ErrorText: React.FC<{ children: ReactNode }> = ({ children }) => (
	<Typography color="danger" fontSize="sm" my={'.5rem'}>
		{children}
	</Typography>
)
