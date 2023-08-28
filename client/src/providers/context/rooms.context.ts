import { createContext } from 'react'
import { CreateRoomParams, TRoom } from '../../types/types'

export type RoomsContextType = {
	rooms: TRoom[]
	changeCurrentRoom: (roomId: number) => void
	currentRoom: null | TRoom
	createNewRoom: (newRoom: CreateRoomParams) => void
}

export const RoomsContext = createContext<RoomsContextType>({} as RoomsContextType)
