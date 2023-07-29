import React, { useCallback, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import AppSpinner from '../components/AppSpinner'
import { useAuth } from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { CreateRoomParams, MessageI, MessageSocketEvent, RoomI } from '../types/types'
import { socketEvents } from '../utils/constants'
import { handleError } from '../utils/handleAxiosErrors'
import { getSavedOrGlobalRoom, isInsideOfApplication, saveRoomIdToSessionStorage } from '../utils/helpers'
import { SocketContext } from './context/socket.contetx'

const websocketURL = import.meta.env.VITE_PUBLIC_URL + '/ws'

interface Props {
	children: React.ReactNode
}

/**
 * Socket provider for the app
 */
const SocketProvider: React.FC<Props> = ({ children }) => {
	const [appSocket, setAppSocket] = useState<null | Socket>(null)

	const [messages, setMessages] = useState<MessageI[]>([])
	const [editingMessageId, setEditingMessageId] = useState<null | number>(null)

	const [rooms, setRooms] = useState<RoomI[]>([])
	const [currentRoom, setCurrentRoom] = useState<RoomI | null>(null)

	const { login, logOut, loggedIn, accessToken } = useAuth()
	const { privateAxios } = useAxiosPrivate()

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

		socket.on('rooms', (rooms: RoomI[]) => {
			setRooms(rooms)
			// changeCurrentRoom(globalRoom.id)
			// setCurrentRoom(globalRoom)
			// const message = getMessagesForRoom(globalRoom.id)
			// console.log('This is message', message)
		})

		socket.on(socketEvents.messageAdded, (event: MessageSocketEvent) => {
			console.log('This is currentRoom', currentRoom)
			if (event.roomId !== currentRoom?.id) return
			setMessages((prev) => [...prev, event.message])
		})

		socket.on(socketEvents.messagePatched, (event: MessageSocketEvent) => {
			console.log('This is event', event)
			console.log('This is currentRoom?.id', currentRoom?.id)
			console.log(event.roomId !== currentRoom?.id)
			if (event.roomId !== currentRoom?.id) return
			console.log('This is messages', messages)
			const mess = messages.find((elem) => elem.id === event.message.id)
			console.log('This is mess', mess)

			const index = messages.findIndex((elem) => elem.id === event.message.id)
			console.log('This is index', index)
			const newMessages = [...messages]

			if (index === -1) return

			newMessages[index] = event.message
			console.log('This is newMessages', newMessages)
			setMessages([...newMessages])
		})

		socket.on(socketEvents.messageDeleted, (event: MessageSocketEvent) => {
			if (event.roomId !== currentRoom?.id) return
			getMessagesForRoom(currentRoom.id)
		})

		setAppSocket(socket)
	}, [logOut])

	useEffect(() => {
		if (rooms.length === 0 && accessToken) {
			const getRooms = async () => {
				try {
					const response = await privateAxios.get('/rooms')

					const room = getSavedOrGlobalRoom(response.data)
					setRooms(response.data)
					setCurrentRoom(room)
					if (room) {
						saveRoomIdToSessionStorage(room.id)
						getMessagesForRoom(room.id)
					}
				} catch (err) {
					handleError(err)
				}
			}
			getRooms()
		}
	}, [createSocket, loggedIn, accessToken])

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
	}, [createSocket, loggedIn, accessToken])

	const getMessagesForRoom = async (roomId: number) => {
		try {
			const response = await privateAxios.get(`room/${roomId}/messages`)
			console.log('This is response.data', response.data)
			setMessages(response.data)
		} catch (err) {
			handleError(err)
		}
	}

	/**
	 * Get messages for the selected room
	 **/
	// useEffect(() => {
	// 	// getInitialCurrentRoom(savedCurrentRoom, rooms)
	// 	// currentRoom && getMessagesForRoom(currentRoom.id)
	// }, [])

	if (!appSocket && isInsideOfApplication()) return <AppSpinner text="socket provider" />

	const sendMessage = async (messageContent: string) => {
		if (!currentRoom) return console.log('Room not selected')
		try {
			const response = await privateAxios.post(`/room/${currentRoom.id}/messages`, {
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
			getMessagesForRoom(selectedRoom.id)
			saveRoomIdToSessionStorage(selectedRoom.id)
		}
	}

	const createNewRoom = async (newRoom: CreateRoomParams) => {
		try {
			const response = await privateAxios.post('/rooms', newRoom)

			console.log('This is response.data', response.data)

			if (typeof response.data === 'number') {
				if (currentRoom?.id !== response.data) return changeCurrentRoom(response.data)
			}
			if (typeof response.data === 'object') {
				setRooms((prev) => [response.data, ...prev])
				setCurrentRoom(response.data)
			}
		} catch (err) {
			handleError(err)
		}
		// appSocket?.emit(socketEvents.createRoom, newRoom, (callback: RoomI) => {
		// 	const newRooms = [...rooms]
		// 	newRooms.unshift(callback)
		// 	setRooms(newRooms)
		// 	setCurrentRoom(callback)
		// })
	}

	const contextValue = {
		appSocket,
		rooms,
		messages,
		currentRoom,
		createNewRoom,
		sendMessage,
		changeCurrentRoom,
		editingMessageId,
		setEditingMessageId,
		getMessagesForRoom,
	}

	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
}

export default SocketProvider
