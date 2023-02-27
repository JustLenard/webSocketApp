import { Button, OutlinedInput } from '@mui/material'
import { useState } from 'react'
import { Form } from 'react-router-dom'
import { socket } from '../websocket/websockets'

interface Props {}

const ChatInput: React.FC<Props> = () => {
	const [message, setMessage] = useState('')

	const handleSubmit = () => {
		console.log('This is message', message)
		socket.emit('sendMessage', message, (data: string) => console.log('This is data', data))
		setMessage('')
	}

	return (
		<Form onSubmit={handleSubmit}>
			<OutlinedInput
				size="small"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<Button type="submit">Submit</Button>
		</Form>
	)
}

export default ChatInput
