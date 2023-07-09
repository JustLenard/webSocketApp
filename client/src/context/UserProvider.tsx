import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { getCookie, removeCookie } from 'typescript-cookie'
import AuthContext from './AuthProvider'
import { IRoom } from '../types/room.type'
import { ISentMessage, MessageI, UserI } from '../types/BE_entities.types'
import AppSpinner from '../components/AppLoading'
import useRefreshToken from '../hooks/useRefresh'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useAuth } from '../hooks/useAuth'

interface IContext {
	user: UserI | null
}

export const UserContext = React.createContext<IContext>({
	user: null,
} as IContext)

interface Props {
	children: React.ReactNode
}

export interface UserData {
	email: string
	firstName: string
	lastName: string
	phone: string
	groups: string
}

/**
 * Socket provider for the app
 */
const UserProvider: React.FC<Props> = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	const { accessToken } = useAuth()

	const appAxios = useAxiosPrivate()

	useEffect(() => {
		const getMyInfo = async () => {
			try {
				setLoading(true)
				const response = await appAxios.get('/users/me')

				setUser(response.data)
			} catch (err) {
				console.log('This is err', err)
			}
			setLoading(false)
		}
		if (accessToken) getMyInfo()
	}, [accessToken])

	const contextValue = {
		user,
	}

	return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export default UserProvider
