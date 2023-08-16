import { createContext } from 'react'
import { UserI } from '../../types/types'

export type UserContextType = {
	user: UserI | null
}

export const UserContext = createContext<UserContextType>({} as UserContextType)
