import { PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import { useAuth, useRooms, useSocket } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { MessageI, MessageSocketEvent } from '../types/types'
import { handleError } from '../utils/handleAxiosErrors'
import { MessagesContext, MessagesContextType } from './context/messages.context'
import { socketEvents } from '../utils/constants'

/**
 * Messages provider for the app
 */
const MessagesProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { loggedIn } = useAuth()
	const { appSocket } = useSocket()
	const { currentRoom } = useRooms()
	const [messages, setMessages] = useState<MessageI[]>([])
	const [editingMessageId, setEditingMessageId] = useState<null | number>(null)

	const { privateAxios } = useAxiosPrivate()

	useEffect(() => {
		if (loggedIn && currentRoom) {
			getMessagesForRoom(currentRoom.id)
		}
	}, [loggedIn, currentRoom])

	/**
	 * Get messages for the selected room
	 **/
	const getMessagesForRoom = async (roomId: number) => {
		try {
			const response = await privateAxios.get(`room/${roomId}/messages`)
			console.log('This is response.data', response.data)
			setMessages(response.data)
		} catch (err) {
			handleError(err)
		}
	}

	const sendMessage = async (messageContent: string) => {
		if (!currentRoom) return console.log('Room not selected')
		try {
			const response = await privateAxios.post(`/room/${currentRoom.id}/messages`, {
				roomId: currentRoom.id,
				text: messageContent,
			})

			// setMessages((prev) => [...prev, response.data])
		} catch (err) {
			handleError(err)
		}
	}

	useEffect(() => {
		if (!appSocket) return

		appSocket.on(socketEvents.messageAdded, (payload: MessageSocketEvent) => {
			console.log('trigger add ')
			setMessages((prev) => [...prev, payload.message])
		})
		appSocket.on(socketEvents.messagePatched, (payload: MessageSocketEvent) => {
			console.log('trigger patch ')
			const index = messages.findIndex((elem) => elem.id === payload.message.id)
			console.log('This is index', index)
			const newMessages = [...messages]
			newMessages.splice(index, 1, payload.message)
			console.log('This is newMessages', newMessages)
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