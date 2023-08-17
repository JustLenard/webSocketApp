import { Grid, Stack } from '@mui/material'
import { useSocket, useUser } from '../../hooks/contextHooks'
import AppSpinner from '../AppSpinner'
import ChatInput from './ChatInput'
import MessagesContainer from './MessagesContainer'
import { Typography } from '@mui/joy'
import { useRooms } from '../../hooks/contextHooks'
import { useEffect, useState } from 'react'
import { socketEvents } from '../../utils/constants'
import { getReceivingUser } from '../../utils/helpers'

const ChatContainer = () => {
	const { appSocket } = useSocket()
	const { currentRoom } = useRooms()
	const { user } = useUser()
	const [isRecipientTyping, setIsRecipientTyping] = useState(false)

	useEffect(() => {
		if (!appSocket) return

		appSocket.on(socketEvents.onTypingStart, () => {
			setIsRecipientTyping(true)
		})
		appSocket.on(socketEvents.onTypingStop, () => {
			setIsRecipientTyping(false)
		})

		return () => {
			appSocket.off(socketEvents.onTypingStart)
			appSocket.off(socketEvents.onTypingStop)
		}
	}, [])

	if (!currentRoom || !user) return <AppSpinner contained text="Chat container" />

	const recipient = getReceivingUser(currentRoom.users, user.id)

	return (
		<Grid container direction={'column'} height={'100%'}>
			<Grid
				item
				xs
				style={{
					flex: 0,
					background: 'gray',
					padding: '1rem',
				}}
			>
				<Typography level="title-md">{currentRoom.name}</Typography>
			</Grid>
			<Grid item xs overflow={'scroll'}>
				<MessagesContainer />
			</Grid>
			<Grid p={'1rem'}>
				<ChatInput />
				<Typography level="body-md" ml={'1rem'} height={'20px'}>
					{isRecipientTyping ? `${recipient.username} is typing...` : ' '}
				</Typography>
			</Grid>
		</Grid>
	)
}

export default ChatContainer
