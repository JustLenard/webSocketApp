import { Box, Button, Input, OutlinedInput } from '@mui/material'
import { Form } from 'react-router-dom'
import ChatInput from './ChatInput'

const ChatContainer = () => {
	return (
		<Box display={'flex'} flexDirection={'column'} flexGrow={1}>
			<Box border={'2px solid blue'} flexGrow={1}></Box>
			<ChatInput />
		</Box>
	)
}

export default ChatContainer
