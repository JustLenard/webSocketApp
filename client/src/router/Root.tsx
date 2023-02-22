import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from '../pages/Login'

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
		element: <div>Hello world!</div>,
	},
])

const Root = () => {
	return <RouterProvider router={router} />
}

export default Root
