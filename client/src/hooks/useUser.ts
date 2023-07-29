import { useContext } from 'react'
import { UserContext } from '../providers/context/user.context'

export const useUser = () => useContext(UserContext)
