import { useEffect, useRef } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useSocket } from '../../hooks/contextHooks'
import { TMessage } from '../../types/types'
import Message from './Message'
import { useMessages } from '../../hooks/contextHooks'

const MessagesContainer = () => {
	const { messages } = useMessages()

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

const renderMessages = (messages: TMessage[]) => {
	return messages.map((mesage, i) => {
		const prev = i === 0 ? null : messages[i - 1]
		return <Message key={mesage.id} message={mesage} prev={prev} />
	})
}
