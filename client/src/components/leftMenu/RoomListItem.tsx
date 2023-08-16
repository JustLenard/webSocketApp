import { Badge, Box, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'
import { ListItemButton, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRooms, useSocket, useUser } from '../../hooks/contextHooks'
import { NotificationSocketEvent, NotificationT, RoomI, UserI } from '../../types/types'
import { socketEvents } from '../../utils/constants'
import { getReceivingUser, utcTimeToHumanTime } from '../../utils/helpers'
import AppSpinner from '../AppSpinner'
import AppAvatar from '../avatar/AppAvatar'
import AppBadge from '../AppBadge'

const RoomListItem: React.FC<RoomI> = ({ id, isGroupChat, name, users, description, lastMessage, notifications }) => {
	const { appSocket } = useSocket()
	const { currentRoom, changeCurrentRoom } = useRooms()
	const { user } = useUser()

	const [roomNotificationsAmount, setRoomNotificaitonsAmount] = useState(notifications.length)
	const [author, setAuthor] = useState(lastMessage && user && createAuthor(lastMessage.user, user))
	const [lastMessageSnippet, setLastMessageSnippet] = useState(lastMessage && lastMessage)

	const handleClick = () => {
		changeCurrentRoom(id)
	}

	if (!currentRoom || !user) return <AppSpinner circle={false} text="Rooms" />

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

			setLastMessageSnippet(payload.notif.message)
			setAuthor(createAuthor(payload.notif.creator, user))

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
						<Stack justifyContent={'space-between'} flexDirection={'row'}>
							<Typography display={'inline-block'}>{conversationName}</Typography>
							<span>
								<Typography display={'inline-block'} textAlign={'end'} level="body-sm">
									{lastMessage && utcTimeToHumanTime(lastMessage.updated_at)}
								</Typography>

								<AppBadge badgeContent={roomNotificationsAmount} />
							</span>
						</Stack>

						<Typography>
							<Typography color="neutral" level="body-md" noWrap>
								{author}
							</Typography>
							<Typography noWrap level="body-sm">
								{lastMessageSnippet?.text}
							</Typography>
						</Typography>
					</ListItemContent>
				</ListItem>
			</ListItemButton>
		</>
	)
}

const createAuthor = (author: UserI, user: UserI) => {
	return author.username === user.username ? 'You: ' : `${author.username}: `
}

export default RoomListItem
