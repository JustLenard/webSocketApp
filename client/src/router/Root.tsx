import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ChatPage from '../pages/ChatPage'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import ProtectedRoute from './ProtectedRoute'

// Define routes for the project
export const appRoutes = {
	login: '/login',
	signUp: '/sign-up',
	chat: '/chat',
}

// Create browser router
const router = createBrowserRouter([
	{
		path: appRoutes.login,
		element: <LoginPage />,
	},
	{
		path: appRoutes.signUp,
		element: <SignUpPage />,
	},
	{
		path: appRoutes.chat,
		element: (
			<ProtectedRoute>
				<ChatPage />
			</ProtectedRoute>
		),
	},
	{
		path: '*',
		element: <div>Not FOund</div>,
	},
])

const Root = () => {
	return <RouterProvider router={router} />
}

export default Root
