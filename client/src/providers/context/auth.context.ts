import { createContext } from 'react'

export type AuthorizationContextType = {
	loggedIn: boolean
	accessToken: string | null
	logOutUser: () => void
	loginUser: (accToken: string) => void
	setAccessToken: React.Dispatch<React.SetStateAction<string | null>>
}

export const AuthContext = createContext<AuthorizationContextType>({ accessToken: null } as AuthorizationContextType)
