import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useAuth, useSocket } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { CreateRoomParams, RoomI } from '../types/types'
import { socketEvents } from '../utils/constants'
import { handleError } from '../utils/handleAxiosErrors'
import { getSavedOrGlobalRoom, saveRoomIdToSessionStorage } from '../utils/helpers'
import { RoomsContext, RoomsContextType } from './context/rooms.context'

/**
 * Socket provider for the app
 */
const RoomsProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { appSocket } = useSocket()
	const [rooms, setRooms] = useState<RoomI[]>([])
	const [currentRoom, setCurrentRoom] = useState<RoomI | null>(null)

	const { login, logOut, loggedIn, accessToken } = useAuth()
	const { privateAxios } = useAxiosPrivate()

	console.log('This is currentRoom', currentRoom)

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

	const changeCurrentRoom = (roomId: number) => {
		const selectedRoom = rooms.find((room) => room.id === roomId)

		if (selectedRoom && appSocket) {
			console.log('This is selectedRoom', selectedRoom)
			setCurrentRoom(selectedRoom)
			saveRoomIdToSessionStorage(selectedRoom.id)

			appSocket.emit(socketEvents.onRoomJoin, selectedRoom.id)
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

	const contextValue: RoomsContextType = {
		rooms,
		currentRoom,
		createNewRoom,
		changeCurrentRoom,
	}

	return <RoomsContext.Provider value={contextValue}>{children}</RoomsContext.Provider>
}

export default RoomsProvider
