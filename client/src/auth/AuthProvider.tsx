import { ReactNode, createContext, useEffect, useState } from 'react'
import useRefreshToken from '../hooks/useRefresh'
import { useNavigate } from 'react-router-dom'
import { routes } from '../router/Root'
import AppLoading from '../components/AppLoading'

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
	const [accessToken, setAccessTokens] = useState<string | null>(null)
	const [loggedIn, setLoggedIn] = useState<boolean>(localStorage.getItem(loggedInKey) === 'true')
	const [loading, setLoading] = useState(false)

	const refresh = useRefreshToken()

	useEffect(() => {
		if (loggedIn && accessToken === null) {
			const getAccessToken = async () => {
				console.log('Getting new acces token')
				setLoading(true)
				const newAccesToken = await refresh()

				if (newAccesToken) {
					setAccessTokens(newAccesToken)
					return setLoading(false)
				}
				logOut()
				setLoading(false)
			}
			getAccessToken()
		}
	}, [accessToken, loggedIn])

	const logOut = () => {
		setAccessTokens(null)
		setLoggedIn(false)
		localStorage.removeItem(loggedInKey)
	}

	const login = (accessToken: string) => {
		setAccessTokens(accessToken)
		setLoggedIn(true)
		localStorage.setItem(loggedInKey, 'true')
	}

	console.log('This is accessToken', accessToken)
	console.log('This is loggedIn', loggedIn)

	const contextValue: IContext = {
		accessToken,
		loggedIn,
		logOut,
		login,
	}

	if (loading) return <AppLoading circle />

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthContext
