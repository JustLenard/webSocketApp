import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import useRefreshToken from '../hooks/useRefresh'
import { PostRoomI, MessageI, RoomI } from '../types/BE_entities.types'
import { IRoom } from '../types/room.type'
import AuthContext from './AuthProvider'
import { socketEvents } from '../websocket/socketEvents'
import { Message } from 'react-hook-form'

const websocketURL = import.meta.env.VITE_PUBLIC_URL + '/ws'

interface IContext {
	appSocket: Socket | null
	rooms: RoomI[]
	messages: MessageI[]
	sendMessage: (message: string) => void
	changeCurrentRoom: (roomId: number) => void
	currentRoom: null | RoomI
	createNewRoom: (newRoom: PostRoomI) => void
}

export const SocketContext = React.createContext<IContext>({} as IContext)

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
	const [messages, setMessages] = useState<MessageI[]>([])
	const [rooms, setRooms] = useState<RoomI[]>([])

	const [currentRoom, setCurrentRoom] = useState<RoomI | null>(null)

	console.log('This is currentRoom', currentRoom)

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

		socket.on('rooms', (rooms: RoomI[]) => {
			setRooms(rooms)

			/**
			 * @todo delete this
			 **/
			setCurrentRoom(rooms[0])
		})

		socket.on(socketEvents.messageAdded, (message: MessageI) => {
			setMessages((prev) => [...prev, message])
		})

		setAppSocket(socket)
	}, [logOut])

	useEffect(() => {
		if (loggedIn && accessToken) {
			console.log('Creating socket connection')
			createSocket()
		} else {
			/**
			 * @todo figure this shit out
			 **/
			// getAccesToken()
		}
		return () => {
			appSocket?.disconnect()
		}
	}, [createSocket, loggedIn])

	// if (!appSocket) return <AppLoading />

	const sendMessage = (messageContent: string) => {
		if (!currentRoom) return console.log('Room not selected')
		appSocket?.emit(
			socketEvents.addMessage,
			{
				text: messageContent,
				room: currentRoom.id,
			},
			// (callback: MessageI) => {
			// 	setMessages((prev) => [...prev, callback])
			// 	console.log('This is callback', callback)
			// },
		)
	}

	const changeCurrentRoom = (roomId: number) => {
		const selectedRoom = rooms?.find((room) => room.id === roomId)

		if (selectedRoom) return setCurrentRoom(selectedRoom)
	}

	const createNewRoom = (newRoom: PostRoomI) => {
		appSocket?.emit(socketEvents.createRoom, newRoom, (callback: RoomI) => {
			const newRooms = [...rooms]
			newRooms.unshift(callback)
			setRooms(newRooms)
			setCurrentRoom(callback)
		})
	}

	const contextValue = {
		appSocket,
		rooms,
		messages,
		currentRoom,
		createNewRoom,
		sendMessage,
		changeCurrentRoom,
	}

	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
}

export default SocketProvider
