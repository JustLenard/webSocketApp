import { Button, FormControl, IconButton, OutlinedInput } from '@mui/material'
import { useContext, useState } from 'react'
import { SocketContext } from '../../context/SocketProvider'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSocket } from '../../hooks/useSocket'
import { Input } from '@mui/joy'
import SendIcon from '@mui/icons-material/Send'

type ChatForm = {
	message: string
}

interface Props {}

const ChatInput: React.FC<Props> = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		resetField,
	} = useForm<ChatForm>()

	const { appSocket, sendMessage } = useSocket()

	const handleMessageSubmit: SubmitHandler<ChatForm> = (formData) => {
		sendMessage(formData.message)

		resetField('message')
	}

	return (
		<form onSubmit={handleSubmit(handleMessageSubmit)}>
			<Input
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
