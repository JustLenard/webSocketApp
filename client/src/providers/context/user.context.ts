import { createContext } from 'react'
import { IShortUser } from '../../types/types'

export type UserContextType = {
	user: IShortUser | null
}

export const UserContext = createContext<UserContextType>({} as UserContextType)
