import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useAuth, useSocket } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { CreateRoomParams, RoomI } from '../types/types'
import { socketEvents } from '../utils/constants'
import { handleError } from '../utils/handleAxiosErrors'
import { getSavedOrGlobalRoom, isInsideOfApplication, saveRoomIdToSessionStorage } from '../utils/helpers'
import { RoomsContext, RoomsContextType } from './context/rooms.context'
import AppSpinner from '../components/AppSpinner'

/**
 * Rooms provider for the app
 */
const RoomsProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { appSocket } = useSocket()
	const [rooms, setRooms] = useState<RoomI[]>([])
	const [currentRoom, setCurrentRoom] = useState<RoomI | null>(null)
	const { privateAxios } = useAxiosPrivate()

	const changeCurrentRoom = (roomId: number) => {
		const selectedRoom = rooms.find((room) => room.id === roomId)

		if (selectedRoom && appSocket) {
			currentRoom && appSocket.emit(socketEvents.onRoomLeave, currentRoom.id)
			appSocket.emit(socketEvents.onRoomJoin, selectedRoom.id)

			setCurrentRoom(selectedRoom)

			saveRoomIdToSessionStorage(selectedRoom.id)
		}
	}

	const createNewRoom = async (newRoom: CreateRoomParams) => {
		try {
			const response = await privateAxios.post('/rooms', newRoom)

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

	console.log('RErender')

	useEffect(() => {
		if (!appSocket) return
		console.log('getting rooms')
		const getRooms = async () => {
			// debugger
			try {
				const response = await privateAxios.get('/rooms')

				const room = getSavedOrGlobalRoom(response.data)
				setRooms(response.data)
				console.log('This is response.data', response.data)
				setCurrentRoom(room)
				if (room) {
					appSocket.emit(socketEvents.onRoomJoin, room.id)
					saveRoomIdToSessionStorage(room.id)
				}
			} catch (err) {
				handleError(err)
			}
		}
		getRooms()
	}, [])

	useEffect(() => {
		if (!appSocket) return
		appSocket.on(socketEvents.createRoom, (room: RoomI) => {
			setRooms((prev) => [{ ...room, notifications: [] }, ...prev])
		})
		return () => {
			appSocket.off(socketEvents.createRoom)
		}
	}, [appSocket, rooms])

	console.log('This is rooms', rooms)
	if (rooms.length === 0 && isInsideOfApplication()) return <AppSpinner text="Getting rooms" />

	const contextValue: RoomsContextType = {
		rooms,
		currentRoom,
		createNewRoom,
		changeCurrentRoom,
	}

	return <RoomsContext.Provider value={contextValue}>{children}</RoomsContext.Provider>
}

export default RoomsProvider
