import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../hooks/reduxHooks'
import { routes } from './Root'

interface Props {
	children: React.ReactElement
}

// Wrapper for a route to make it protected.
const ProtectedRoute: React.FC<Props> = ({ children }) => {
	const location = useLocation()
	const logedIn = useAppSelector((state) => state.auth.logedIn)

	// If the user is not loged in, send him to log in page.
	// Save the curent page route to memory for redirect after log in.
	if (!logedIn) {
		return <Navigate to={routes.login} state={{ path: location.pathname }} />
	}
	return children
}

export default ProtectedRoute
