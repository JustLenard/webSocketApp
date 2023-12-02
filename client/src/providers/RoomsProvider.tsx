import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useAuth, useSocket } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { CreateRoomParams, TRoom } from '../types/types'
import { socketEvents } from '../utils/constants'
import { handleError } from '../utils/handleAxiosErrors'
import { getSavedOrGlobalRoom, saveRoomIdToSessionStorage } from '../utils/helpers'
import { RoomsContext, RoomsContextType } from './context/rooms.context'
import { useAppDispatch } from '../hooks/reduxHooks'
import { addNewRoom, markRoomNotifAsRead, setUpNotification } from '../redux/slices/notifications.slice'

/**
 * Rooms provider for the app
 */
const RoomsProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { appSocket } = useSocket()
	const { privateAxios } = useAxiosPrivate()
	const { accessToken } = useAuth()
	const dispatch = useAppDispatch()

	const [rooms, setRooms] = useState<TRoom[]>([])
	const [currentRoom, setCurrentRoom] = useState<TRoom | null>(null)

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
			console.log('This is newRoom', newRoom)
			const response = await privateAxios.post('/rooms', newRoom)

			if (typeof response.data === 'number') {
				if (currentRoom?.id !== response.data) {
					return changeCurrentRoom(response.data)
				}
			}
			if (typeof response.data === 'object') {
				setRooms((prev) => [response.data, ...prev])
				setCurrentRoom(response.data)
				dispatch(addNewRoom(response.data))
			}
		} catch (err) {
			handleError(err)
		}
	}

	useEffect(() => {
		if (!accessToken || !appSocket) return

		const getRooms = async () => {
			try {
				const response = await privateAxios.get('/rooms')

				const room = getSavedOrGlobalRoom(response.data)
				setRooms(response.data)
				dispatch(setUpNotification(response.data))

				setCurrentRoom(room)
				if (room) {
					appSocket.emit(socketEvents.onRoomJoin, room.id)
					saveRoomIdToSessionStorage(room.id)
					if (room.notifications) {
						appSocket.emit(socketEvents.markNotificationsAsRead, room.id, (res: string) => {
							if (res === 'ok') dispatch(markRoomNotifAsRead(room.id))
						})
					}
				}
			} catch (err) {
				handleError(err)
			}
		}
		getRooms()
	}, [appSocket])

	useEffect(() => {
		if (!appSocket) return
		appSocket.on(socketEvents.createRoom, (room: TRoom) => {
			setRooms((prev) => [{ ...room, notifications: 0 }, ...prev])
			dispatch(addNewRoom(room))
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
