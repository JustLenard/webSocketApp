import { RoomI } from '../types/BE_entities.types'
import { GLOBAL_ROOM_NAME } from './constants'

export const getGlobalRoom = (rooms: RoomI[]) => {
	return rooms.find((room) => room.id === 1 && room.name === GLOBAL_ROOM_NAME && room.isGroupChat) ?? null
}
