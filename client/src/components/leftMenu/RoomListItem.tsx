import { Badge, ListDivider, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'
import { ListItemButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRooms, useSocket, useUser } from '../../hooks/contextHooks'
import { NotificationSocketEvent, RoomI } from '../../types/types'
import { socketEvents } from '../../utils/constants'
import { getReceivingUser } from '../../utils/helpers'
import AppSpinner from '../AppSpinner'
import AppAvatar from '../avatar/AppAvatar'

const RoomListItem: React.FC<RoomI> = ({ id, isGroupChat, name, users, description, lastMessage, notifications }) => {
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
		appSocket.on(socketEvents.newNotification, (payload: NotificationSocketEvent) => {
			if (payload.roomId !== id) return
			setLastMessageText(payload.notif.message.text)
			if (user.id !== payload.notif.creator.id && currentRoom.id !== payload.notif.room.id) {
				setRoomNotificaitonsAmount((prev) => prev + 1)
			} else {
				appSocket.emit(socketEvents.markNotificationsAsRead, id)
			}
		})

		return () => {
			appSocket.off(socketEvents.markNotificationsAsRead)
			appSocket.off(socketEvents.newNotification)
		}
	}, [appSocket, currentRoom])

	return (
		<>
			<ListItemButton onClick={handleClick} selected={currentRoom.id === id} sx={{ width: 'inherit' }}>
				<ListItem sx={{ width: 'inherit' }}>
					<ListItemDecorator sx={{ alignSelf: 'flex-start', mr: '.5rem' }}>
						<AppAvatar username={conversationName} />
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

export default RoomListItem
