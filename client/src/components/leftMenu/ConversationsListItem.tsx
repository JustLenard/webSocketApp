import { Avatar, ListDivider, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'
import { useContext } from 'react'
import { SocketContext } from '../../context/SocketProvider'
import { useUser } from '../../hooks/useUser'
import { RoomI } from '../../types/BE_entities.types'
import { getReceivingUser } from '../../utils/utils'
import AppSpinner from '../AppSpinner'
import { ListItemButton } from '@mui/material'

const ConversationsListItem: React.FC<RoomI> = ({ id, isGroupChat, name, users, description, lastMessage }) => {
	const { currentRoom, changeCurrentRoom, appSocket } = useContext(SocketContext)
	const { user } = useUser()

	const handleClick = () => {
		changeCurrentRoom(id)
	}

	if (!currentRoom || !user) return <AppSpinner circle={false} />

	const receivingUser = getReceivingUser(users, user.id)
	const conversationName = isGroupChat ? name : receivingUser.username

	return (
		<>
			<ListItemButton onClick={handleClick}>
				<ListItem>
					<ListItemDecorator sx={{ alignSelf: 'flex-start', mr: '.5rem' }}>
						<Avatar src="/static/images/avatar/1.jpg" />
					</ListItemDecorator>
					<ListItemContent>
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
