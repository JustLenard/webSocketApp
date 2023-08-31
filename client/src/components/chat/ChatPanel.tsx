import { Typography } from '@mui/joy'
import { Divider, Grid, Stack, useMediaQuery, useTheme } from '@mui/material'
import { useRooms, useSocket, useUser } from '../../hooks/contextHooks'
import { getReceivingUser } from '../../utils/helpers'
import AppSpinner from '../AppSpinner'
import AppDrawer from '../drawer/AppDrawer'
import LeftMenu from '../leftMenu/LeftMenu'
import RightMenu from '../rightMenu/RightMenu'
import ChatInput from './ChatInput'
import MessagesContainer from './MessagesContainer'
import TypingIndicator from './TypingIndicator'

const ChatPanel = () => {
	const { currentRoom } = useRooms()
	const { user } = useUser()

	const theme = useTheme()
	const downMdBreakpoint = useMediaQuery(theme.breakpoints.down('md'))
	const downLgBreakpoint = useMediaQuery(theme.breakpoints.down('lg'))

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
			<Grid p={'1rem 1rem .4rem 1rem'}>
				<ChatInput />
				<TypingIndicator />
			</Grid>
		</Grid>
	)
}

export default ChatPanel
