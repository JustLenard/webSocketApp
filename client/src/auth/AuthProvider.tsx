import { ReactNode, createContext, useEffect, useState } from 'react'
import useRefreshToken from '../hooks/useRefresh'
import { useNavigate } from 'react-router-dom'
import { routes } from '../router/Root'
import AppLoading from '../components/AppLoading'
import { axiosPrivate } from '../api/axios'
import { UserI } from '../types/BE_entities.types'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

interface IContext {
	loggedIn: boolean
	accessToken: string | null
	user: UserI | null
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
	const [user, setUser] = useState<UserI | null>(null)

	const refresh = useRefreshToken()
	const appAxios = useAxiosPrivate()

	/**
	 * Get access token if uses still has valid refresh token
	 **/
	useEffect(() => {
		if (loggedIn && accessToken === null) {
			const getAccessToken = async () => {
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

		if (accessToken && !user) {
			const getMyInfo = async () => {
				try {
					const response = await appAxios.get('/users/me')

					setUser(response.data)
				} catch (err) {
					console.log('This is err', err)
				}
			}
			getMyInfo()
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

	const contextValue: IContext = {
		accessToken,
		loggedIn,
		user,
		logOut,
		login,
	}

	if (loading) return <AppLoading circle />

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthContext
