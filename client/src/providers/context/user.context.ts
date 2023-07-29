import { createContext } from 'react'
import { UserI } from '../../types/types'

interface IContext {
	user: UserI | null
}

export const UserContext = createContext<IContext>({
	user: null,
} as IContext)
