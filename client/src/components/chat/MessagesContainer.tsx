import { useContext, useEffect, useRef, useState } from 'react'
import { SocketContext } from '../../context/SocketProvider'
import Message from './Message'
import { useSocket } from '../../hooks/useSocket'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { MessageI } from '../../types/BE_entities.types'
import { NUMBERS } from '../../utils/constants'

interface Props {}

const MessagesContainer: React.FC<Props> = () => {
	const { privateAxios } = useAxiosPrivate()
	const { messages, appSocket, currentRoom } = useSocket()

	const messagesRef = useRef<HTMLDivElement | null>(null)

	const scrollToLastMessage = () => {
		const lastChild = messagesRef.current?.lastElementChild
		lastChild?.scrollIntoView()
	}

	useEffect(() => {
		scrollToLastMessage()
	}, [messages])

	return <div ref={messagesRef}>{messages && renderMessages(messages)}</div>
}

export default MessagesContainer

const renderMessages = (messages: MessageI[]) => {
	return messages.map((mesage, i) => {
		const prev = i === 0 ? null : messages[i - 1]
		return <Message key={mesage.id} message={mesage} prev={prev} />
	})
}
