import { ReactNode, createContext, useEffect, useState } from 'react'
import AppSpinner from '../components/AppSpinner'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useRefreshToken from '../hooks/useRefresh'
import { isInsideOfApplication } from '../utils/helpers'
import { appRoutes } from '../router/Root'
import { handleError } from '../utils/handleAxiosErrors'
import { LOGGED_IN_KEY_NAME } from '../utils/constants'
import { AuthContext, IContext } from './context/auth.context'

interface Props {
	children: ReactNode
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [loggedIn, setLoggedIn] = useState<boolean>(sessionStorage.getItem(LOGGED_IN_KEY_NAME) === 'true')
	const [loading, setLoading] = useState(false)

	// console.log('This is accessToken', accessToken)
	console.log('This is loggedIn', loggedIn)
	// console.log('This is loading', loading)

	const refresh = useRefreshToken()

	// console.log('This is refresh', refresh)
	const { privateAxios } = useAxiosPrivate()

	/**
	 * Get access token if user still has valid refresh token
	 **/
	useEffect(() => {
		console.log('This is isInsideOfApplication()', isInsideOfApplication())

		const getAccessToken = async () => {
			console.log('bruh')
			const newAccesToken = await refresh()

			if (newAccesToken) {
				setAccessToken(newAccesToken)

				return newAccesToken
			}
			return logOut()
		}

		const initialLaoad = async () => {
			if (loggedIn && accessToken === null && isInsideOfApplication()) {
				// setLoading(true)
				await getAccessToken()
			} else if (!loggedIn && isInsideOfApplication()) {
				location.assign(appRoutes.login)
			}
			// setLoading(false)
		}

		initialLaoad()
	}, [])

	const logOut = () => {
		try {
			const response = privateAxios.post('/logout')
		} catch (err) {
			handleError(err)
		}

		setAccessToken(null)
		setLoggedIn(false)
		sessionStorage.removeItem(LOGGED_IN_KEY_NAME)
	}

	const login = (accessToken: string) => {
		console.log('This is accessToken in login', accessToken)
		setAccessToken(accessToken)
		setLoggedIn(true)
		sessionStorage.setItem(LOGGED_IN_KEY_NAME, 'true')
	}

	const contextValue: IContext = {
		accessToken,
		loggedIn,
		logOut,
		login,
	}

	// if (loading) return <AppSpinner />

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthContext
