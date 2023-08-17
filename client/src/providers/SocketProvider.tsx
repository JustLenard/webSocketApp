import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { useAuth } from '../hooks/contextHooks'
import { SocketContext, SocketContextType } from './context/socket.contetx'
import AppSpinner from '../components/AppSpinner'
import { isInsideOfApplication, showSpinner } from '../utils/helpers'
import useRefreshToken from '../hooks/useRefresh'
import { socketEvents } from '../utils/constants'

const websocketURL = import.meta.env.VITE_PUBLIC_URL

/**
 * Socket provider for the app
 */
const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [appSocket, setAppSocket] = useState<null | Socket>(null)

	const { logOutUser, loggedIn, accessToken } = useAuth()
	const getNewAccesToken = useRefreshToken()
	const [connectionCreated, setConnectionCreated] = useState(false)
	console.log('socket shit')

	const createSocketConnection = useCallback(async () => {
		// let socket = crateSocket(accessToken)

		console.log('This is accessToken in socket', accessToken)
		const socket: Socket = io(`${websocketURL}`, {
			reconnection: true,
			transportOptions: {
				polling: {
					extraHeaders: {
						Authorization: `Bearer ${accessToken}`,
						// Authorization: `Bearer `,
					},
				},
			},
		})

		socket.on(socketEvents.connect, () => {
			setAppSocket(socket)
			setConnectionCreated(socket.connected)
		})
	}, [])

	useEffect(() => {
		if (isInsideOfApplication()) {
			createSocketConnection()
		}
	}, [createSocketConnection, accessToken])

	if (showSpinner(!connectionCreated)) return <AppSpinner text="Creating webSocket connection" />

	const contextValue: SocketContextType = {
		appSocket,
	}

	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
}

export default SocketProvider
