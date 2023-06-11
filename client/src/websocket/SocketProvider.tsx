import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { getCookie, removeCookie } from 'typescript-cookie'
import AuthContext from '../auth/AuthProvider'
import { IRoom } from '../types/room.type'
import { ISentMessage, MessageI } from '../types/BE_entities.types'
import AppLoading from '../components/AppLoading'

const websocketURL = import.meta.env.VITE_PUBLIC_URL + '/ws'

interface IContext {
	appSocket: Socket
	rooms: null | IRoom[]
	sendMessage: (message: string) => void
	selectCurrentRoom: (roomId: number) => void
}

export const SocketContext = React.createContext<IContext>({
	rooms: null,
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
const SocketProvider: React.FC<Props> = ({ children }) => {
	const [appSocket, setAppSocket] = useState<null | Socket>(null)
	const [messages, setMessages] = useState<null | MessageI[]>(null)
	const [rooms, setRooms] = useState<null | IRoom[]>(null)
	const [currentRoom, setCurrentRoom] = useState<number | null>(null)

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

		console.log('Connected to WebSocket server on ' + websocketURL)

		socket.on('messages', (messages: MessageI[]) => {
			console.log('This is messages', messages)
			setMessages(messages)
		})

		socket.on('disconnect', () => {
			console.log('Disconnected from WebSocket server')
		})

		/* Close socket connection when specific event is triggered  by back end*/
		socket.on('closeSocket', () => {
			socket.disconnect()
			console.log(`Closing connection`)
		})

		socket.on('rooms', (rooms: IRoom[]) => {
			console.log('This is rooms', rooms)
			setRooms(rooms)
		})

		setAppSocket(socket)
	}, [logOut])

	useEffect(() => {
		if (loggedIn) {
			createSocket()
		}
	}, [createSocket, loggedIn])

	if (!appSocket) return <AppLoading />

	const sendMessage = (messageContent: string) => {
		appSocket.emit('addMessage', {
			text: messageContent,
			room: selectCurrentRoom,
		})
		//
	}

	const selectCurrentRoom = (roomId: number) => {
		setCurrentRoom(roomId)
	}

	const contextValue = {
		appSocket,
		rooms,
		sendMessage,
		messages,
		selectCurrentRoom,
	}

	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
}

export default SocketProvider
