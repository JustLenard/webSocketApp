import { PropsWithChildren, useEffect, useState } from 'react'
import { useRooms, useSocket } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { MessageSocketEvent, TMessage } from '../types/types'
import { socketEvents } from '../utils/constants'
import { handleError } from '../utils/handleAxiosErrors'
import { MessagesContext, MessagesContextType } from './context/messages.context'

/**
 * Messages provider for the app
 */
const MessagesProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { privateAxios } = useAxiosPrivate()
	const { appSocket } = useSocket()
	const { currentRoom } = useRooms()

	const [messages, setMessages] = useState<TMessage[]>([])
	const [editingMessageId, setEditingMessageId] = useState<null | number>(null)

	/**
	 * Get messages for the selected room
	 **/
	const getMessagesForRoom = async (roomId: number) => {
		try {
			const response = await privateAxios.get(`room/${roomId}/messages`)
			setMessages(response.data)
		} catch (err) {
			handleError(err)
		}
	}

	const sendMessage = async (messageContent: string) => {
		if (!currentRoom) return
		try {
			privateAxios.post(`/room/${currentRoom.id}/messages`, {
				roomId: currentRoom.id,
				text: messageContent,
			})
		} catch (err) {
			handleError(err)
		}
	}

	useEffect(() => {
		if (currentRoom) {
			getMessagesForRoom(currentRoom.id)
		}
	}, [currentRoom])

	useEffect(() => {
		if (!appSocket) return

		appSocket.on(socketEvents.messageAdded, (payload: MessageSocketEvent) => {
			console.log('This is messageAdded payload', payload)
			setMessages((prev) => [...prev, payload.message])
		})
		appSocket.on(socketEvents.messagePatched, (payload: MessageSocketEvent) => {
			const index = messages.findIndex((elem) => elem.id === payload.message.id)
			const newMessages = [...messages]
			newMessages.splice(index, 1, payload.message)
			setMessages([...newMessages])
		})
		appSocket.on(socketEvents.messageDeleted, (payload: MessageSocketEvent) => {
			const newMessages = messages.filter((item) => item.id !== payload.message.id)
			setMessages(newMessages)
		})

		return () => {
			appSocket.off(socketEvents.messageAdded)
			appSocket.off(socketEvents.messageDeleted)
			appSocket.off(socketEvents.messagePatched)
		}
	}, [currentRoom, messages])

	const contextValue: MessagesContextType = {
		getMessagesForRoom,
		messages,
		sendMessage,
		editingMessageId,
		setEditingMessageId,
	}

	return <MessagesContext.Provider value={contextValue}>{children}</MessagesContext.Provider>
}

export default MessagesProvider
