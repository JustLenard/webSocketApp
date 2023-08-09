import { Avatar, Badge, ListDivider, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'
import { ListItemButton } from '@mui/material'
import { useSocket } from '../../hooks/contextHooks'
import { useUser } from '../../hooks/contextHooks'
import { NotificationSocketEvent, NotificationT, RoomI } from '../../types/types'
import { createNotifRoomName, getReceivingUser } from '../../utils/helpers'
import AppSpinner from '../AppSpinner'
import { useRooms } from '../../hooks/contextHooks'
import { useEffect, useState } from 'react'
import { socketEvents } from '../../utils/constants'

const ConversationsListItem: React.FC<RoomI> = ({
	id,
	isGroupChat,
	name,
	users,
	description,
	lastMessage,
	notifications,
}) => {
	const { appSocket } = useSocket()
	const { currentRoom, changeCurrentRoom } = useRooms()
	const { user } = useUser()
	const [roomNotificationsAmount, setRoomNotificaitonsAmount] = useState(notifications.length)
	const [lastMessageText, setLastMessageText] = useState(
		notifications.length === 0 ? lastMessage?.text : notifications[0].message.text,
	)

	const handleClick = () => {
		changeCurrentRoom(id)
	}

	if (!currentRoom || !user) return <AppSpinner circle={false} />

	const receivingUser = getReceivingUser(users, user.id)
	const conversationName = isGroupChat ? name : receivingUser.username

	useEffect(() => {
		if (!appSocket) return
		if (currentRoom.id === id) {
			appSocket.emit(socketEvents.markNotificationsAsRead, id, (res: string) => {
				if (res === 'ok') setRoomNotificaitonsAmount(0)
			})
		}
		return () => {
			appSocket.off(socketEvents.markNotificationsAsRead)
		}
	}, [appSocket, currentRoom])

	useEffect(() => {
		if (!appSocket) return
		appSocket.on(socketEvents.newNotification, (payload: NotificationSocketEvent) => {
			if (payload.roomId !== id) return
			console.log('This is payload', payload)
			setLastMessageText(payload.notif.message.text)
			setRoomNotificaitonsAmount((prev) => prev + 1)
		})
	}, [appSocket])

	return (
		<>
			<ListItemButton onClick={handleClick} selected={currentRoom.id === id} sx={{ width: 'inherit' }}>
				<ListItem sx={{ width: 'inherit' }}>
					<ListItemDecorator sx={{ alignSelf: 'flex-start', mr: '.5rem' }}>
						<Avatar />
					</ListItemDecorator>
					<ListItemContent>
						<Badge color="danger" badgeContent={roomNotificationsAmount}>
							<Typography>{conversationName}</Typography>
						</Badge>

						<Typography level="body2" noWrap>
							{lastMessageText}
						</Typography>
					</ListItemContent>
				</ListItem>
			</ListItemButton>
			<ListDivider inset={'context'} />
		</>
	)
}

export default ConversationsListItem
