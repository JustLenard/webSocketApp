import { createContext } from 'react'
import { UserI } from '../../types/types'

export type UserContextType = {
	user: UserI | null
}

export const UserContext = createContext<UserContextType>({
	user: null,
} as UserContextType)
