import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useAuth, useSocket } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { CreateRoomParams, RoomI } from '../types/types'
import { socketEvents } from '../utils/constants'
import { handleError } from '../utils/handleAxiosErrors'
import { getSavedOrGlobalRoom, saveRoomIdToSessionStorage } from '../utils/helpers'
import { RoomsContext, RoomsContextType } from './context/rooms.context'

/**
 * Rooms provider for the app
 */
const RoomsProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { appSocket } = useSocket()
	const [rooms, setRooms] = useState<RoomI[]>([])
	const [currentRoom, setCurrentRoom] = useState<RoomI | null>(null)

	const { login, logOut, loggedIn, accessToken } = useAuth()
	const { privateAxios } = useAxiosPrivate()

	console.log('This is currentRoom', currentRoom)

	const changeCurrentRoom = (roomId: number) => {
		const selectedRoom = rooms.find((room) => room.id === roomId)

		if (selectedRoom && appSocket) {
			console.log('This is selectedRoom', selectedRoom)

			currentRoom && appSocket.emit(socketEvents.onRoomLeave, currentRoom.id)
			appSocket.emit(socketEvents.onRoomJoin, selectedRoom.id)

			if (selectedRoom.notifications.length !== 0) {
				appSocket.emit(socketEvents.markNotificationsAsRead, selectedRoom.id, (res: string) => {
					setCurrentRoom({
						...selectedRoom,
						notifications: [],
					})
				})
			} else {
				setCurrentRoom(selectedRoom)
			}
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
	}

	useEffect(() => {
		if (accessToken) {
			const getRooms = async () => {
				try {
					const response = await privateAxios.get('/rooms')

					const room = getSavedOrGlobalRoom(response.data)
					setRooms(response.data)
					setCurrentRoom(room)
					console.log('This is room', room)
					if (room && appSocket) {
						appSocket.emit(socketEvents.onRoomJoin, room.id)
						saveRoomIdToSessionStorage(room.id)
					}
				} catch (err) {
					handleError(err)
				}
			}
			getRooms()
		}
	}, [loggedIn, accessToken])

	useEffect(() => {
		if (!appSocket) return
		appSocket.on(socketEvents.createRoom, (room: RoomI) => {
			setRooms((prev) => [room, ...prev])
		})
		return () => {
			appSocket.off(socketEvents.createRoom)
		}
	}, [appSocket, rooms])

	const contextValue: RoomsContextType = {
		rooms,
		currentRoom,
		createNewRoom,
		changeCurrentRoom,
	}

	return <RoomsContext.Provider value={contextValue}>{children}</RoomsContext.Provider>
}

export default RoomsProvider
