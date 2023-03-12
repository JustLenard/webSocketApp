import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ChatPage from '../pages/ChatPage'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'

const router = createBrowserRouter([
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/sign-up',
		element: <SignUpPage />,
	},
	{
		path: '/',
		element: <ChatPage />,
	},
])

const Root = () => {
	return <RouterProvider router={router} />
}

export default Root
