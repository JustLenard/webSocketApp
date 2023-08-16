import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { useAuth } from '../hooks/contextHooks'
import { SocketContext, SocketContextType } from './context/socket.contetx'
import AppSpinner from '../components/AppSpinner'
import { isInsideOfApplication } from '../utils/helpers'
import useRefreshToken from '../hooks/useRefresh'

const websocketURL = import.meta.env.VITE_PUBLIC_URL

/**
 * Socket provider for the app
 */
const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [appSocket, setAppSocket] = useState<null | Socket>(null)

	const { logOut, loggedIn, accessToken } = useAuth()
	const getNewAccesToken = useRefreshToken()

	const createSocketConnection = useCallback(
		async (accessToken: string) => {
			// debugger
			console.log('creating new socket')
			const newAccessToken = await getNewAccesToken()
			let socket = crateSocket(newAccessToken)
			// let socket = crateSocket('fail')

			console.log('This is socket.connected', socket.connected)
			// if (!socket.connected) {
			// 	const newAccessToken = await getNewAccesToken()
			// 	console.log('This is newAccessToken', newAccessToken)

			// 	socket = crateSocket(newAccessToken)
			// 	console.log('This is socket', socket)
			// }
			console.log('setting socket')
			setAppSocket(socket)
			console.log('This is socket', socket)
		},
		[logOut],
	)

	useEffect(() => {
		console.log('This is accessToken', accessToken)
		console.log('This is loggedIn', loggedIn)
		if (loggedIn && accessToken) {
			console.log('Creating socket connection')
			createSocketConnection(accessToken)
		}
	}, [createSocketConnection, loggedIn, accessToken])

	useEffect(() => {
		if (!appSocket) return
		console.log('This is appSocket', appSocket)
		appSocket.on('badToken', (val) => console.log('This is val', val))

		return () => {
			appSocket.off('badToken')
		}
	}, [appSocket])

	const contextValue: SocketContextType = {
		appSocket,
	}

	if (!appSocket && isInsideOfApplication() && accessToken) return <AppSpinner text="Creating webSocket connection" />

	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
}

const crateSocket = (accessToken: string) => {
	const socket: Socket = io(`${websocketURL}`, {
		reconnection: true, // enable automatic reconnect
		// reconnectionAttempts: 3, // maximum number of reconnection attempts
		// reconnectionDelay: 5000, // delay between reconnection attempts (in ms)
		transportOptions: {
			polling: {
				extraHeaders: {
					Authorization: `Bearer ${accessToken}`,
					// Authorization: `Bearer `,
				},
			},
		},
	})
	return socket
}

export default SocketProvider
