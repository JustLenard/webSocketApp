import { TMessage } from '../../types/types'
import { Dispatch, SetStateAction, createContext } from 'react'

export type MessagesContextType = {
	messages: TMessage[]
	sendMessage: (message: string) => void
	getMessagesForRoom: (roomId: number) => void
	editingMessageId: number | null
	setEditingMessageId: Dispatch<SetStateAction<number | null>>
}

export const MessagesContext = createContext<MessagesContextType>({} as MessagesContextType)
