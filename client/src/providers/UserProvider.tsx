import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { UserI } from '../types/types'
import { UserContext } from './context/user.context'

interface Props {
	children: React.ReactNode
}

/**
 * Socket provider for the app
 */
const UserProvider: React.FC<Props> = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	const { accessToken } = useAuth()

	const { privateAxios } = useAxiosPrivate()

	useEffect(() => {
		const getMyInfo = async () => {
			try {
				setLoading(true)
				const response = await privateAxios.get('/users/me')

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
