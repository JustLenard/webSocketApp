import { Avatar, ListDivider, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'
import { ListItemButton } from '@mui/material'
import { useSocket } from '../../hooks/contextHooks'
import { useUser } from '../../hooks/contextHooks'
import { RoomI } from '../../types/types'
import { getReceivingUser } from '../../utils/helpers'
import AppSpinner from '../AppSpinner'
import { useRooms } from '../../hooks/contextHooks'

const ConversationsListItem: React.FC<RoomI> = ({ id, isGroupChat, name, users, description, lastMessage }) => {
	const { currentRoom, changeCurrentRoom } = useRooms()
	const { user } = useUser()

	const handleClick = () => {
		changeCurrentRoom(id)
	}

	if (!currentRoom || !user) return <AppSpinner circle={false} />

	const receivingUser = getReceivingUser(users, user.id)
	const conversationName = isGroupChat ? name : receivingUser.username

	return (
		<>
			<ListItemButton onClick={handleClick} selected={currentRoom.id === id} sx={{ border: '2px solid cyan' }}>
				<ListItem>
					<ListItemDecorator sx={{ alignSelf: 'flex-start', mr: '.5rem' }}>
						<Avatar />
					</ListItemDecorator>
					<ListItemContent
						sx={{
							// width: '100%',
							width: 'inherit',

							border: '1px solid gray',
						}}
					>
						<Typography>{conversationName}</Typography>
						<Typography level="body2" noWrap>
							{lastMessage?.text}
						</Typography>
					</ListItemContent>
				</ListItem>
			</ListItemButton>
			<ListDivider inset={'context'} />
		</>
	)
}

export default ConversationsListItem
