import { createContext } from 'react'

export type AuthorizationContextType = {
	loggedIn: boolean
	accessToken: string | null
	logOut: () => void
	login: (accToken: string) => void
}

export const AuthContext = createContext<AuthorizationContextType>({ accessToken: null } as AuthorizationContextType)
