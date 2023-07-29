import { createContext } from 'react'
import { CreateRoomParams, RoomI } from '../../types/types'

export type RoomsContextType = {
	rooms: RoomI[]
	changeCurrentRoom: (roomId: number) => void
	currentRoom: null | RoomI
	createNewRoom: (newRoom: CreateRoomParams) => void
}

export const RoomsContext = createContext<RoomsContextType>({} as RoomsContextType)
