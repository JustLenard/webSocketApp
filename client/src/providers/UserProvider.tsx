import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useAuth } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { UserContext } from './context/user.context'

/**
 * Socket provider for the app
 */
const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
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
