import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ChatPage from '../pages/ChatPage'
import Login from '../pages/LoginPage'

const router = createBrowserRouter([
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/siginin',
		element: <div>Sigin in!</div>,
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
