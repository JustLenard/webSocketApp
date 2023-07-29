import { Socket } from 'socket.io-client'
import { CreateRoomParams, MessageI, RoomI } from '../../types/types'
import { Dispatch, SetStateAction, createContext } from 'react'

export interface IContext {
	appSocket: Socket | null
	rooms: RoomI[]
	messages: MessageI[]
	sendMessage: (message: string) => void
	changeCurrentRoom: (roomId: number) => void
	currentRoom: null | RoomI
	createNewRoom: (newRoom: CreateRoomParams) => void
	getMessagesForRoom: (roomId: number) => void
	editingMessageId: number | null
	setEditingMessageId: Dispatch<SetStateAction<number | null>>
}

export const SocketContext = createContext<IContext>({} as IContext)
