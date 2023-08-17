import { createContext } from 'react'

export type AuthorizationContextType = {
	loggedIn: boolean
	accessToken: string | null
	logOutUser: () => void
	loginUser: (accToken: string) => void
	setNewToken: (newToken: string) => void
}

export const AuthContext = createContext<AuthorizationContextType>({ accessToken: null } as AuthorizationContextType)
