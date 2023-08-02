import SendIcon from '@mui/icons-material/Send'
import { Input } from '@mui/joy'
import { IconButton } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRooms, useSocket } from '../../hooks/contextHooks'
import { useMessages } from '../../hooks/contextHooks'
import { useState } from 'react'
import { socketEvents } from '../../utils/constants'

type ChatForm = {
	message: string
}

interface Props {}

const ChatInput: React.FC<Props> = () => {
	const { appSocket } = useSocket()
	const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>()
	const { currentRoom } = useRooms()
	const [isTyping, setIsTyping] = useState(false)
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		resetField,
	} = useForm<ChatForm>()

	const { sendMessage } = useMessages()

	const handleMessageSubmit: SubmitHandler<ChatForm> = (formData) => {
		sendMessage(formData.message)

		resetField('message')
	}

	const sendTypingStatus = () => {
		if (!appSocket || !currentRoom) return

		setIsTyping(true)
		// console.log('User is typing')
		appSocket.emit(socketEvents.onTypingStart, currentRoom.id)
		clearTimeout(timer)
		setTimer(
			setTimeout(() => {
				// console.log('User stopped typing')
				appSocket.emit(socketEvents.onTypingStop, currentRoom.id)
				setIsTyping(false)
			}, 2000),
		)
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
