import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useAuth } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { UserContext, UserContextType } from './context/user.context'
import { isInsideOfApplication } from '../utils/helpers'
import AppSpinner from '../components/AppSpinner'
import { handleError } from '../utils/handleAxiosErrors'
import { UserI } from '../types/types'

/**
 * Socket provider for the app
 */
const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<UserI | null>(null)
	const [loading, setLoading] = useState(false)

	const { accessToken } = useAuth()

	const { privateAxios } = useAxiosPrivate()

	useEffect(() => {
		const getMyInfo = async () => {
			try {
				setLoading(true)
				const response = await privateAxios.get('/users/me')

				setUser(response.data)
			} catch (err) {
				handleError(err)
			}
			setLoading(false)
		}
		if (accessToken && isInsideOfApplication()) getMyInfo()
	}, [accessToken])

	if (loading) return <AppSpinner text="Getting User" />

	const contextValue: UserContextType = {
		user,
	}

	return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export default UserProvider
