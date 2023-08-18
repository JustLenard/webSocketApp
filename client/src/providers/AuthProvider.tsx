import { PropsWithChildren, ReactNode, createContext, useEffect, useState } from 'react'
import AppSpinner from '../components/AppSpinner'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useRefreshToken from '../hooks/useRefresh'
import { isInsideOfApplication, showSpinner } from '../utils/helpers'
import { appRoutes } from '../router/Root'
import { handleError } from '../utils/handleAxiosErrors'
import { LOGGED_IN_KEY_NAME, TRUE } from '../utils/constants'
import { AuthContext, AuthorizationContextType } from './context/auth.context'

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const refresh = useRefreshToken()
	const { privateAxios } = useAxiosPrivate()

	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [loggedIn, setLoggedIn] = useState<boolean>(sessionStorage.getItem(LOGGED_IN_KEY_NAME) === TRUE)
	const [loading, setLoading] = useState(false)
	const [loggingOut, setLoggingOut] = useState(false)

	/**
	 * Get access token if user still has valid refresh token
	 **/
	useEffect(() => {
		const getAccessToken = async () => {
			const newAccesToken = await refresh()

			if (newAccesToken) {
				return newAccesToken
			}
			return logOutUser
		}

		const initialLaoad = async () => {
			if (accessToken === null && isInsideOfApplication()) {
				setLoading(true)
				const accessToken: string | undefined = await getAccessToken()
				accessToken && loginUser(accessToken)
				setLoading(false)
			}
		}
		initialLaoad()
	}, [])

	/**
	 * Logout user
	 **/
	const logOutUser = async () => {
		setLoggingOut(true)
		location.assign(appRoutes.login)
		setAccessToken(null)
		setLoggedIn(false)
		sessionStorage.removeItem(LOGGED_IN_KEY_NAME)

		try {
			await privateAxios.post('/auth/logout')
		} catch (err) {
			handleError(err)
		}
		setLoggingOut(false)
	}

	const setNewToken = (newToken: string) => {
		setAccessToken(newToken)
	}

	/**
	 * Login user
	 **/
	const loginUser = (accessToken: string) => {
		setAccessToken(accessToken)
		setLoggedIn(true)
		sessionStorage.setItem(LOGGED_IN_KEY_NAME, TRUE)
	}

	if (loggingOut) return <AppSpinner text="Logging out" />

	if (showSpinner(loading) || showSpinner(!accessToken)) return <AppSpinner text="Authentificating" />

	const contextValue: AuthorizationContextType = {
		accessToken,
		loggedIn,
		logOutUser,
		loginUser,
		setNewToken,
	}

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthContext
