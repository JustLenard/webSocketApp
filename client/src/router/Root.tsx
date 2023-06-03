import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ChatPage from '../pages/ChatPage'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import ProtectedRoute from './ProtectedRoute'

// Define routes for the project
export const routes = {
	login: '/login',
	signUp: '/sign-up',
	chat: '/chat',
}

// Create browser router
const router = createBrowserRouter([
	{
		path: routes.login,
		element: <LoginPage />,
	},
	{
		path: routes.signUp,
		element: <SignUpPage />,
	},
	{
		path: routes.chat,
		element: (
			<ProtectedRoute>
				<ChatPage />
			</ProtectedRoute>
		),
	},
])

const Root = () => {
	return <RouterProvider router={router} />
}

export default Root
