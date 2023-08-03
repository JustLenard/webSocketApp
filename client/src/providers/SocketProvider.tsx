import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { useAuth } from '../hooks/contextHooks'
import { SocketContext, SocketContextType } from './context/socket.contetx'
import AppSpinner from '../components/AppSpinner'
import { isInsideOfApplication } from '../utils/helpers'

const websocketURL = import.meta.env.VITE_PUBLIC_URL

/**
 * Socket provider for the app
 */
const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [appSocket, setAppSocket] = useState<null | Socket>(null)

	const { logOut, loggedIn, accessToken } = useAuth()

	const createSocket = useCallback(() => {
		console.log('creating new socket')
		const socket: Socket = io(`${websocketURL}`, {
			reconnection: true, // enable automatic reconnect
			reconnectionAttempts: 1, // maximum number of reconnection attempts
			reconnectionDelay: 1000, // delay between reconnection attempts (in ms)
			transportOptions: {
				polling: {
					extraHeaders: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			},
		})
		setAppSocket(socket)
	}, [logOut])

	useEffect(() => {
		if (loggedIn && accessToken) {
			console.log('Creating socket connection')
			createSocket()
		} else {
			/**
			 * @todo figure thi	s shit out
			 **/
			// getAccesToken()
		}
		return () => {
			appSocket?.disconnect()
		}
	}, [createSocket, loggedIn, accessToken])

	const contextValue: SocketContextType = {
		appSocket,
	}

	if (!appSocket && isInsideOfApplication()) return <AppSpinner />

	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
}

export default SocketProvider