import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useAuth } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { UserContext, UserContextType } from './context/user.context'
import { isInsideOfApplication, showSpinner } from '../utils/helpers'
import AppSpinner from '../components/AppSpinner'
import { handleError } from '../utils/handleAxiosErrors'
import { IShortUser } from '../types/types'

/**
 * Socket provider for the app
 */
const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { privateAxios } = useAxiosPrivate()
	const { accessToken } = useAuth()

	const [user, setUser] = useState<IShortUser | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!isInsideOfApplication()) return
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
		getMyInfo()
	}, [accessToken])

	if (showSpinner(loading)) return <AppSpinner text="Getting User" />

	const contextValue: UserContextType = {
		user,
	}

	return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export default UserProvider
