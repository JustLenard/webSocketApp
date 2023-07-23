import { useEffect, useRef } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useSocket } from '../../hooks/useSocket'
import { MessageI } from '../../types/BE_entities.types'
import Message from './Message'

const MessagesContainer = () => {
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
