import { ReactNode, useEffect, useState } from 'react'
import { useAuth, useRooms, useSocket } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { MessageI, MessageSocketEvent } from '../types/types'
import { handleError } from '../utils/handleAxiosErrors'
import { MessagesContext, MessagesContextType } from './context/messages.context'
import { socketEvents } from '../utils/constants'

interface Props {
	children: ReactNode
}

/**
 * Messages provider for the app
 */
const MessagesProvider: React.FC<Props> = ({ children }) => {
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

			setMessages((prev) => [...prev, response.data])
		} catch (err) {
			handleError(err)
		}
	}

	useEffect(() => {
		// if (!appSocket || !currentRoom) return
		if (!appSocket) return

		console.log('pass')
		appSocket.on(socketEvents.messageAdded, (payload: MessageSocketEvent) => {
			addNewMessage(payload)
		})
	}, [appSocket])

	const addNewMessage = (payload: MessageSocketEvent) => {
		if (currentRoom?.id !== payload.roomId) return
		setMessages((prev) => [...prev, payload.message])
	}

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
