import React, { useCallback, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import AppSpinner from '../components/AppSpinner'
import { useAuth } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { CreateRoomParams, MessageI, MessageSocketEvent, RoomI } from '../types/types'
import { socketEvents } from '../utils/constants'
import { handleError } from '../utils/handleAxiosErrors'
import { getSavedOrGlobalRoom, isInsideOfApplication, saveRoomIdToSessionStorage } from '../utils/helpers'
import { SocketContext } from './context/socket.contetx'
import { RoomsContext } from './context/rooms.context'

interface Props {
	children: React.ReactNode
}

/**
 * Socket provider for the app
 */
const RoomsProvider: React.FC<Props> = ({ children }) => {
	const [rooms, setRooms] = useState<RoomI[]>([])
	const [currentRoom, setCurrentRoom] = useState<RoomI | null>(null)

	const { login, logOut, loggedIn, accessToken } = useAuth()
	const { privateAxios } = useAxiosPrivate()

	console.log('This is currentRoom', currentRoom)

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

		if (selectedRoom) {
			setCurrentRoom(selectedRoom)
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

	const contextValue = {
		rooms,
		currentRoom,
		createNewRoom,
		changeCurrentRoom,
	}

	return <RoomsContext.Provider value={contextValue}>{children}</RoomsContext.Provider>
}

export default RoomsProvider
