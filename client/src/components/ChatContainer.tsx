import { Box, Button, FormControl, Input, OutlinedInput } from '@mui/material'
import { useContext, useEffect } from 'react'
import { Form } from 'react-router-dom'
import { apiRequest } from '../utils/ApiRequest'
import ChatInput from './ChatInput'
import AuthContext from '../auth/AuthProvider'
import { SocketContext } from '../websocket/SocketProvider'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IRoom } from '../types/room.type'

type ChatForm = {
	message: string
}

const ChatContainer = () => {
	const { logOut } = useContext(AuthContext)

	const { appSocket, sendMessage } = useContext(SocketContext)
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		resetField,
	} = useForm<ChatForm>()

	const handleMessageSubmit: SubmitHandler<ChatForm> = (formData) => {
		console.log('This is message', formData)

		sendMessage(formData.message)

		resetField('message')
	}

	const createRoom = () => {
		const newRoom: IRoom = {
			name: 'First room',
			users: [],
		}

		appSocket.emit('createRoom', newRoom)
	}

	return (
		<>
			<form onSubmit={handleSubmit(handleMessageSubmit)}>
				<FormControl>
					<Input placeholder="Your message... " {...register('message')} />
				</FormControl>
				<Button type="submit">Submit</Button>
			</form>

			<Button onClick={createRoom}>Create Room</Button>

			<Button onClick={logOut}>Logout</Button>
		</>
	)
}

export default ChatContainer
