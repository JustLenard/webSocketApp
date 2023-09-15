import SendIcon from '@mui/icons-material/Send'
import { Input } from '@mui/joy'
import { IconButton } from '@mui/material'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMessages, useRooms, useSocket } from '../../hooks/contextHooks'
import { socketEvents } from '../../utils/constants'

type ChatForm = {
	message: string
}

const ChatInput = () => {
	const { sendMessage } = useMessages()
	const { register, handleSubmit, resetField } = useForm<ChatForm>()

	const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>()
	const [isTyping, setIsTyping] = useState(false)
	const { appSocket } = useSocket()
	const { currentRoom } = useRooms()

	const handleMessageSubmit: SubmitHandler<ChatForm> = (formData) => {
		if (!appSocket || !currentRoom) return
		appSocket.emit(socketEvents.onTypingStop, currentRoom.id)
		setIsTyping(false)
		sendMessage(formData.message.trim())
		resetField('message')
	}

	const sendTypingStatus = () => {
		if (!appSocket || !currentRoom) return

		if (isTyping) {
			clearTimeout(timer)
			setTimer(
				setTimeout(() => {
					appSocket.emit(socketEvents.onTypingStop, currentRoom.id)
					setIsTyping(false)
				}, 1000),
			)
		} else {
			setIsTyping(true)
			appSocket.emit(socketEvents.onTypingStart, currentRoom.id)
			clearTimeout(timer)
			setTimer(
				setTimeout(() => {
					appSocket.emit(socketEvents.onTypingStop, currentRoom.id)
					setIsTyping(false)
				}, 1000),
			)
		}
	}

	return (
		<form onSubmit={handleSubmit(handleMessageSubmit)}>
			<Input
				onKeyDown={sendTypingStatus}
				autoComplete="off"
				placeholder="Your message... "
				{...register('message')}
				fullWidth
				variant="outlined"
				endDecorator={
					<IconButton type="submit">
						<SendIcon />
					</IconButton>
				}
			/>
		</form>
	)
}

export default ChatInput
