import { Grid, Paper, Stack } from '@mui/material'
import { useSocket, useUser } from '../../hooks/contextHooks'
import AppSpinner from '../AppSpinner'
import ChatInput from './ChatInput'
import MessagesContainer from './MessagesContainer'
import { Typography } from '@mui/joy'
import { useRooms } from '../../hooks/contextHooks'
import { useEffect, useState } from 'react'
import { socketEvents } from '../../utils/constants'
import { getReceivingUser } from '../../utils/helpers'
import RightDrawer from '../rightMenu/RightMenuDrawer'

const ChatPanel = () => {
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

	if (!currentRoom || !user) return <AppSpinner contained />

	const recipient = getReceivingUser(currentRoom.users, user.id)
	const conversationName = currentRoom.isGroupChat ? currentRoom.name : recipient.username

	return (
		<Grid container direction={'column'} height={'100%'}>
			{/* <Grid
				item
				xs
				sx={{
					flex: 0,
					background: 'gray',
					padding: '1rem',
				}}
			>
				<Paper elevation={12}>
					<Typography level="title-md">{conversationName}</Typography>
				</Paper>
			</Grid> */}
			<Paper elevation={12}>
				<Typography level="title-md">{conversationName}</Typography>
				<RightDrawer />
			</Paper>
			<Grid item xs overflow={'scroll'}>
				<MessagesContainer />
			</Grid>
			<Grid p={'1rem'}>
				<ChatInput />
				<Typography level="body-sm" ml={'1rem'} height={'20px'}>
					{isRecipientTyping ? `${recipient.username} is typing...` : ' '}
				</Typography>
			</Grid>
		</Grid>
	)
}

export default ChatPanel
