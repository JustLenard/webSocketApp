import { Divider, Grid, Paper, Stack, useMediaQuery, useTheme } from '@mui/material'
import { useSocket, useUser } from '../../hooks/contextHooks'
import AppSpinner from '../AppSpinner'
import ChatInput from './ChatInput'
import MessagesContainer from './MessagesContainer'
import { Box, Typography } from '@mui/joy'
import { useRooms } from '../../hooks/contextHooks'
import { useEffect, useState } from 'react'
import { socketEvents } from '../../utils/constants'
import { getReceivingUser } from '../../utils/helpers'
import AppDrawer from '../drawer/AppDrawer'
import RightMenu from '../rightMenu/RightMenu'
import LeftMenu from '../leftMenu/LeftMenu'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'

const ChatPanel = () => {
	const { appSocket } = useSocket()
	const { currentRoom } = useRooms()
	const { user } = useUser()
	// const [isRecipientTyping, setIsRecipientTyping] = useState(false)
	const [userTyping, setUserTyping] = useState<null | string>(null)

	const theme = useTheme()
	const downMdBreakpoint = useMediaQuery(theme.breakpoints.down('md'))
	const downLgBreakpoint = useMediaQuery(theme.breakpoints.down('lg'))

	useEffect(() => {
		if (!appSocket) return
		appSocket.on(socketEvents.onTypingStart, (userName: string) => {
			// setIsRecipientTyping(true)
			setUserTyping(userName)
		})
		appSocket.on(socketEvents.onTypingStop, () => {
			// setIsRecipientTyping(false)
			setUserTyping(null)
		})
		return () => {
			appSocket.off(socketEvents.onTypingStart)
			appSocket.off(socketEvents.onTypingStop)
		}
	}, [])

	if (!currentRoom || !user) return <AppSpinner contained text="No current room" />

	const recipient = getReceivingUser(currentRoom.users, user.id)
	const conversationName = currentRoom.isGroupChat ? currentRoom.name : recipient.username

	return (
		<Grid container direction={'column'} height={'100%'}>
			<Stack direction={'row'} p={'.5rem'} alignItems={'center'}>
				{downMdBreakpoint && (
					<AppDrawer direction="left">
						<LeftMenu />
					</AppDrawer>
				)}
				<Typography level="title-md" p={'.5rem'} mr={'auto'}>
					{conversationName}
				</Typography>
				{downLgBreakpoint && (
					<AppDrawer direction="right">
						<RightMenu />
					</AppDrawer>
				)}
			</Stack>
			<Divider />
			<Grid item xs overflow={'scroll'}>
				<MessagesContainer />
			</Grid>
			<Grid p={'1rem'}>
				<ChatInput />
				<Typography level="body-sm" ml={'1rem'} height={'20px'}>
					{/* {isRecipientTyping ? `${recipient.username} is typing...` : ' '} */}
					{userTyping ? `${userTyping} is typing...` : ' '}
				</Typography>
			</Grid>
		</Grid>
	)
}

export default ChatPanel
