import { createContext } from 'react'
import { IShortUser } from '../../types/interfaces'

export type UserContextType = {
	user: IShortUser | null
}

export const UserContext = createContext<UserContextType>({} as UserContextType)
