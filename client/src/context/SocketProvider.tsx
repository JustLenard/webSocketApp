import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import useRefreshToken from '../hooks/useRefresh'
import { PostRoomI, MessageI, RoomI } from '../types/BE_entities.types'
import { IRoom } from '../types/room.type'
import AuthContext from './AuthProvider'
import { socketEvents } from '../websocket/socketEvents'
import { Message } from 'react-hook-form'
import { GLOBAL_ROOM_NAME } from '../utils/constants'
import { useAuth } from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { handleError } from '../utils/handleAxiosErrors'

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

	const { login, logOut, loggedIn, accessToken } = useAuth()
	const privateAxios = useAxiosPrivate()

	console.log('This is currentRoom', currentRoom)
	// const getAccesToken = useRefreshToken()

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

		socket.on('connect', () => {})

		socket.on('messages', (messages: MessageI[]) => {
			console.log('This is messages', messages)
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

			const globalRoom = getGlobalRoom(rooms)

			if (!globalRoom) return

			setCurrentRoom(globalRoom)

			// changeCurrentRoom(globalRoom.id)
			// setCurrentRoom(globalRoom)
			// const message = getMessagesForRoom(globalRoom.id)
			// console.log('This is message', message)
		})

		socket.on(socketEvents.messageAdded, (message: MessageI) => {
			setMessages((prev) => [...prev, message])
		})

		setAppSocket(socket)
	}, [logOut])

	useEffect(() => {
		console.log('This is accessToken', accessToken)
		console.log('This is loggedIn', loggedIn)
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
	}, [createSocket, loggedIn, accessToken])

	/**
	 * Get messages for the selected room
	 **/
	useEffect(() => {
		const getMessagesForRoom = async (roomId: number) => {
			// appSocket?.emit(socketEvents.getMessagesForRoom, roomId, (callback: MessageI[]) => {
			// 	setMessages(callback)
			// 	console.log('This is callback', callback)
			// })

			try {
				const response = await privateAxios.get(`/messages/${roomId}`)
				console.log('This is response.data', response.data)
				setMessages(response.data)
			} catch (err) {
				// console.log('This is err', err.response)
			}
		}
		currentRoom && getMessagesForRoom(currentRoom.id)
	}, [currentRoom])

	// if (!appSocket) return <AppLoading />

	const sendMessage = async (messageContent: string) => {
		if (!currentRoom) return console.log('Room not selected')
		try {
			const response = await privateAxios.post('/messages', {
				roomId: currentRoom.id,
				text: messageContent,
			})

			setMessages((prev) => [...prev, response.data])
		} catch (err) {
			handleError(err)
		}
	}

	const changeCurrentRoom = (roomId: number) => {
		const selectedRoom = rooms.find((room) => room.id === roomId)

		if (selectedRoom) {
			setCurrentRoom(selectedRoom)
		}
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

const getGlobalRoom = (rooms: RoomI[]) => {
	return rooms.find((room) => room.id === 1 && room.name === GLOBAL_ROOM_NAME && room.isGroupChat) ?? null
}

export default SocketProvider
