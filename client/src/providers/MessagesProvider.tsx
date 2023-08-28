import { PropsWithChildren, useEffect, useState } from 'react'
import AppSpinner from '../components/AppSpinner'
import { useAuth, useRooms, useSocket } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { TMessage, MessageSocketEvent } from '../types/types'
import { socketEvents } from '../utils/constants'
import { handleError } from '../utils/handleAxiosErrors'
import { showSpinner } from '../utils/helpers'
import { MessagesContext, MessagesContextType } from './context/messages.context'

/**
 * Messages provider for the app
 */
const MessagesProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const { privateAxios } = useAxiosPrivate()
	const { loggedIn } = useAuth()
	const { appSocket } = useSocket()
	const { currentRoom } = useRooms()

	const [messages, setMessages] = useState<TMessage[]>([])
	const [editingMessageId, setEditingMessageId] = useState<null | number>(null)
	const [loading, setLoading] = useState(true)

	/**
	 * Get messages for the selected room
	 **/
	const getMessagesForRoom = async (roomId: number) => {
		try {
			setLoading(true)
			const response = await privateAxios.get(`room/${roomId}/messages`)
			setMessages(response.data)
		} catch (err) {
			handleError(err)
		}
		setLoading(false)
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
		if (loggedIn && currentRoom) {
			getMessagesForRoom(currentRoom.id)
		}
	}, [loggedIn, currentRoom])

	useEffect(() => {
		if (!appSocket) return

		appSocket.on(socketEvents.messageAdded, (payload: MessageSocketEvent) => {
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

	if (showSpinner(loading)) return <AppSpinner contained text="Loading messages" />

	return <MessagesContext.Provider value={contextValue}>{children}</MessagesContext.Provider>
}

export default MessagesProvider
