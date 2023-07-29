import { RoomI, UserI } from '../types/types'
import { CURRENT_ROOM_KEY_NAME, GLOBAL_ROOM_NAME } from './constants'
import { appRoutes } from '../router/Root'

export const isInsideOfApplication = () => {
	return location.pathname !== appRoutes.login && location.pathname !== appRoutes.signUp
}

export const getReceivingUser = (users: UserI[], userId: string) => {
	return users.filter((user) => user.id !== userId)[0]
}

/**
 * Rooms utils
 **/
export const getCurrentRoomFromSessionStorage = () => {
	const res = sessionStorage.getItem(CURRENT_ROOM_KEY_NAME)

	if (typeof res === 'string') {
		const id = Number(res)
		if (!isNaN(id)) return id
	}
	return null
}

export const getGlobalRoom = (rooms: RoomI[]) => {
	return rooms.find((room) => room.id === 1 && room.name === GLOBAL_ROOM_NAME && room.isGroupChat) ?? null
}

export const getSavedOrGlobalRoom = (rooms: RoomI[]) => {
	const savedCurrentRoomId = getCurrentRoomFromSessionStorage()
	const currentRoom = rooms.find((room) => room.id === savedCurrentRoomId)

	if (currentRoom) return currentRoom
	return getGlobalRoom(rooms)
}

export const saveRoomIdToSessionStorage = (roomId: number) => {
	return sessionStorage.setItem(CURRENT_ROOM_KEY_NAME, roomId.toString())
}
