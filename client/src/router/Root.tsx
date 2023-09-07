import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoadingPage from './LoadingPage'
import ProtectedRoute from './ProtectedRoute'

/**
 * All the project routes
 **/
export const appRoutes = {
	login: '/login',
	signUp: '/sign-up',
	chat: '/chat',
	notFound: '*',
}

/**
 * Lazy laod the pages
 **/
const LazyLoginPage = lazy(() => import('../pages/LoginPage'))
const LazySignUpPage = lazy(() => import('../pages/SignUpPage'))
const LazyChatPage = lazy(() => import('../pages/ChatPage'))
const LazyNotFound = lazy(() => import('../pages/NotFound'))

/**
 * Create browser router
 **/
const router = createBrowserRouter([
	{
		path: appRoutes.login,
		element: (
			<LoadingPage>
				<LazyLoginPage />
			</LoadingPage>
		),
	},
	{
		path: appRoutes.signUp,
		element: (
			<LoadingPage>
				<LazySignUpPage />
			</LoadingPage>
		),
	},
	{
		path: appRoutes.chat,
		element: (
			<ProtectedRoute>
				<LoadingPage>
					<LazyChatPage />
				</LoadingPage>
			</ProtectedRoute>
		),
	},
	{
		path: appRoutes.notFound,
		element: (
			<LoadingPage>
				<LazyNotFound />
			</LoadingPage>
		),
	},
])

const Root = () => {
	return <RouterProvider router={router} />
}

export default Root
