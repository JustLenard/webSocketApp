import { Approval } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { appRoutes } from '../router/Root'

const NotFound = () => {
	const navigate = useNavigate()

	return (
		<>
			<h3>Page not found</h3>
			<Button onClick={() => navigate(appRoutes.chat)}>Go to chat</Button>
		</>
	)
}

export default NotFound
