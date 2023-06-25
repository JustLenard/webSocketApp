import { Button, FormControl, Input, OutlinedInput } from '@mui/material'
import { useContext, useState } from 'react'
import { SocketContext } from '../websocket/SocketProvider'
import { SubmitHandler, useForm } from 'react-hook-form'

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

	const { appSocket, sendMessage } = useContext(SocketContext)

	const handleMessageSubmit: SubmitHandler<ChatForm> = (formData) => {
		console.log('This is message', formData)

		sendMessage(formData.message)

		resetField('message')
	}

	return (
		<form onSubmit={handleSubmit(handleMessageSubmit)}>
			<FormControl>
				<Input placeholder="Your message... " {...register('message')} />
			</FormControl>
			<Button type="submit">Submit</Button>
		</form>
	)
}

export default ChatInput
