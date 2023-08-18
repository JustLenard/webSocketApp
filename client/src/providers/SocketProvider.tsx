import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import AppSpinner from '../components/AppSpinner'
import { useAuth } from '../hooks/contextHooks'
import { socketEvents } from '../utils/constants'
import { isInsideOfApplication, showSpinner } from '../utils/helpers'
import { SocketContext, SocketContextType } from './context/socket.contetx'

const websocketURL = import.meta.env.VITE_PUBLIC_URL

/**
 * Socket provider for the app
 */
const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { accessToken } = useAuth()

	const [appSocket, setAppSocket] = useState<null | Socket>(null)
	const [connectionCreated, setConnectionCreated] = useState(false)

	const createSocketConnection = useCallback(async (accessToken: string) => {
		const socket: Socket = io(`${websocketURL}`, {
			reconnection: true,
			transportOptions: {
				polling: {
					extraHeaders: {
						Authorization: `Bearer ${accessToken}`,
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
		if (isInsideOfApplication() && accessToken) {
			createSocketConnection(accessToken)
		}
	}, [createSocketConnection, accessToken])

	if (showSpinner(!connectionCreated)) return <AppSpinner text="Creating webSocket connection" />

	const contextValue: SocketContextType = {
		appSocket,
	}

	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
}

export default SocketProvider
