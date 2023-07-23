import { RoomI, UserI } from '../types/BE_entities.types'
import { GLOBAL_ROOM_NAME } from './constants'
import { appRoutes } from '../router/Root'

export const getGlobalRoom = (rooms: RoomI[]) => {
	return rooms.find((room) => room.id === 1 && room.name === GLOBAL_ROOM_NAME && room.isGroupChat) ?? null
}

export const isInsideOfApplication = () => {
	return location.pathname !== appRoutes.login && location.pathname !== appRoutes.signUp
}

export const getReceivingUser = (users: UserI[], userId: string) => {
	return users.filter((user) => user.id !== userId)[0]
}
