import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/contextHooks'
import { appRoutes } from './Root'
import { PropsWithChildren } from 'react'

// Wrapper for a route to make it protected.
const ProtectedRoute: React.FC<any> = ({ children }) => {
	const location = useLocation()
	const { loggedIn } = useAuth()

	// If the user is not loged in, send him to log in page.
	// Save the curent page route to memory for redirect after log in.
	if (!loggedIn) {
		console.log('Redirecting to login')
		return <Navigate to={appRoutes.login} state={{ path: location.pathname }} />
	}
	return children
}

export default ProtectedRoute
