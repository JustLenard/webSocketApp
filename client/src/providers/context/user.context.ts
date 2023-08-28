import { createContext } from 'react'
import { TUser } from '../../types/types'

export type UserContextType = {
	user: TUser | null
}

export const UserContext = createContext<UserContextType>({} as UserContextType)
