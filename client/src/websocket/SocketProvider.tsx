import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { getCookie, removeCookie } from 'typescript-cookie'
import AuthContext from '../auth/AuthProvider'
import { IRoom } from '../types/room.type'
import { ISentMessage, MessageI } from '../types/BE_entities.types'
import AppLoading from '../components/AppLoading'
import useRefreshToken from '../hooks/useRefresh'
import { useNavigate } from 'react-router-dom'

const websocketURL = import.meta.env.VITE_PUBLIC_URL + '/ws'

interface IContext {
	appSocket: Socket | null
	rooms: null | IRoom[]
	messages: MessageI[] | null
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
	// const [currentRoom, setCurrentRoom] = useState<number | null>(null)
	const [currentRoom, setCurrentRoom] = useState<number | null>(1)

	const { login, logOut, loggedIn, accessToken } = useContext(AuthContext)

	const getAccesToken = useRefreshToken()

	const createSocket = useCallback(() => {
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

		socket.on('connect', () => {})

		socket.on('messages', (messages: MessageI[]) => {
			setMessages(messages)
		})

		socket.on('messageAdded', (newMessage: MessageI[]) => {
			// setMessages(messages)
		})

		socket.on('disconnect', () => {})

		/* Close socket connection when specific event is triggered  by back end*/
		socket.on('closeSocket', () => {
			socket.disconnect()
		})

		socket.on('rooms', (rooms: IRoom[]) => {
			setRooms(rooms)
		})

		setAppSocket(socket)
	}, [logOut])

	useEffect(() => {
		if (loggedIn && accessToken) {
			createSocket()
		} else {
			/**
			 * @todo figure this shit out
			 **/
			getAccesToken()
		}
	}, [createSocket, loggedIn])

	// if (!appSocket) return <AppLoading />

	const sendMessage = (messageContent: string) => {
		appSocket?.emit('addMessage', {
			text: messageContent,
			room: currentRoom,
		})
	}

	const selectCurrentRoom = (roomId: number) => {
		setCurrentRoom(roomId)
	}

	const contextValue = {
		appSocket,
		rooms,
		messages,
		sendMessage,
		selectCurrentRoom,
	}

	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
}

export default SocketProvider
