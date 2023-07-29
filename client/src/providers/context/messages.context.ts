import { Socket } from 'socket.io-client'
import { CreateRoomParams, MessageI, RoomI } from '../../types/types'
import { Dispatch, SetStateAction, createContext } from 'react'

export type MessagesContextType = {
	messages: MessageI[]
	sendMessage: (message: string) => void
	getMessagesForRoom: (roomId: number) => void
	editingMessageId: number | null
	setEditingMessageId: Dispatch<SetStateAction<number | null>>
}

export const MessagesContext = createContext<MessagesContextType>({} as MessagesContextType)
