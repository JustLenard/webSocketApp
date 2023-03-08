import { Box, Button, Input, OutlinedInput } from '@mui/material'
import { useEffect } from 'react'
import { Form } from 'react-router-dom'
import { apiRequest } from '../utils/ApiRequest'
import ChatInput from './ChatInput'

const ChatContainer = () => {
	useEffect(() => {
		const getSTuff = async () => {
			const res = await apiRequest('/users', 'POST', {
				username: 'len',
				password: '123',
			})

			console.log('This is res', res)
		}
		getSTuff()
	}, [])

	return (
		<Box display={'flex'} flexDirection={'column'} flexGrow={1}>
			<Box border={'2px solid blue'} flexGrow={1}></Box>
			<ChatInput />
		</Box>
	)
}

export default ChatContainer
