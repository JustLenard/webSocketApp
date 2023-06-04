import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { getCookie, removeCookie } from 'typescript-cookie'
import AuthContext from '../auth/AuthProvider'

const websocketURL = import.meta.env.VITE_PUBLIC_URL + '/ws'

interface IContext {
	appSocket: null | Socket
}

export const SocketContext = React.createContext<IContext>({
	appSocket: null,
})

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
const SocketProvider: React.FC<Props> = ({ children }) => {
	const [appSocket, setAppSocket] = useState<null | Socket>(null)
	const { login, logOut, loggedIn, accessToken } = useContext(AuthContext)

	const createSocket = useCallback(() => {
		if (!accessToken) return

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

		socket.on('connect', () => {
			console.log('Connected to WebSocket server on ' + websocketURL)
		})

		socket.on('disconnect', () => {
			console.log('Disconnected from WebSocket server')
		})

		/* Close socket connection when specific event is triggered  by back end*/
		socket.on('closeSocket', () => {
			socket.disconnect()
			console.log(`Closing connection`)
		})

		socket.on('rooms', (rooms: any) => {
			console.log('This is rooms', rooms)
		})

		setAppSocket(socket)
	}, [logOut])

	const contextValue = {
		appSocket,
	}

	useEffect(() => {
		if (loggedIn) {
			createSocket()
		}
	}, [createSocket, loggedIn])

	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
}

export default SocketProvider
