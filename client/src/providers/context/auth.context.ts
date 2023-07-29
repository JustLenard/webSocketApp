import { createContext } from 'react'

export interface IContext {
	loggedIn: boolean
	accessToken: string | null
	logOut: () => void
	login: (accToken: string) => void
}

export const AuthContext = createContext<IContext>({ accessToken: null } as IContext)
