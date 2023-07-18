import { ReactNode, createContext, useEffect, useState } from 'react'
import AppSpinner from '../components/AppSpinner'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useRefreshToken from '../hooks/useRefresh'
import { isInsideOfApplication } from '../utils/allowedToTriggerRefresh'
import { appRoutes } from '../router/Root'

interface IContext {
	loggedIn: boolean
	accessToken: string | null
	logOut: () => void
	login: (accToken: string) => void
}

const AuthContext = createContext<IContext>({ accessToken: null } as IContext)

interface Props {
	children: ReactNode
}

const loggedInKey = import.meta.env.VITE_LOGGED_IN

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [loggedIn, setLoggedIn] = useState<boolean>(localStorage.getItem(loggedInKey) === 'true')
	const [loading, setLoading] = useState(false)

	// console.log('This is accessToken', accessToken)
	console.log('This is loggedIn', loggedIn)
	// console.log('This is loading', loading)

	const refresh = useRefreshToken()

	// console.log('This is refresh', refresh)
	const appAxios = useAxiosPrivate()

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
		setAccessToken(null)
		setLoggedIn(false)
		localStorage.removeItem(loggedInKey)
	}

	const login = (accessToken: string) => {
		console.log('This is accessToken in login', accessToken)
		setAccessToken(accessToken)
		setLoggedIn(true)
		localStorage.setItem(loggedInKey, 'true')
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
