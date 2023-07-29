import React, { useCallback, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import AppSpinner from '../components/AppSpinner'
import { useAuth } from '../hooks/contextHooks'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { CreateRoomParams, MessageI, MessageSocketEvent, RoomI } from '../types/types'
import { socketEvents } from '../utils/constants'
import { handleError } from '../utils/handleAxiosErrors'
import { getSavedOrGlobalRoom, isInsideOfApplication, saveRoomIdToSessionStorage } from '../utils/helpers'
import { SocketContext, SocketContextType } from './context/socket.contetx'
import { useRooms } from '../hooks/contextHooks'
import { MessagesContext, MessagesContextType } from './context/messages.context'

interface Props {
	children: React.ReactNode
}

/**
 * Messages provider for the app
 */
const MessagesProvider: React.FC<Props> = ({ children }) => {
	const { loggedIn } = useAuth()
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
