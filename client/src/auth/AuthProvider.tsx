import { ReactNode, createContext, useState } from 'react'

interface IContext {
	// loggedIn: boolean
	accessToken: string | null
	logOut: () => void
	login: (accToken: string) => void
}

const AuthContext = createContext<IContext>({ accessToken: null } as IContext)

interface Props {
	children: ReactNode
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const [accessToken, setAccessTokens] = useState<string | null>(null)

	const logOut = () => {
		setAccessTokens(null)
	}

	const login = (accessToken: string) => {
		setAccessTokens(accessToken)
	}

	const contextValue: IContext = {
		accessToken,
		logOut,
		login,
	}

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthContext
