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

const RoomListItem: React.FC<RoomI> = ({
	id,
	isGroupChat,
	name,
	users,
	lastMessage: lastMessageProp,
	notifications,
}) => {
	const { appSocket } = useSocket()
	const { currentRoom, changeCurrentRoom } = useRooms()
	const { user } = useUser()

	const [roomNotificationsAmount, setRoomNotificaitonsAmount] = useState(notifications.length)
	const [author, setAuthor] = useState(lastMessageProp && user && createAuthor(lastMessageProp.user, user))
	const [lastMessage, setLastMessage] = useState(lastMessageProp && lastMessageProp)

	const handleClick = () => {
		changeCurrentRoom(id)
	}

	console.log('This is currentRoom', currentRoom)
	if (!currentRoom || !user) return <AppSpinner circle={false} text="Rooms" />

	const receivingUser = getReceivingUser(users, user.id)
	const conversationName = isGroupChat ? name : receivingUser.username

	useEffect(() => {
		if (!appSocket) return
		// if (currentRoom.id === id && roomNotificationsAmount > 0) {
		// 	console.log('This is currentRoom.id === id', currentRoom.id === id)
		// 	appSocket.emit(socketEvents.markNotificationsAsRead, id, (res: string) => {
		// 		if (res === 'ok') setRoomNotificaitonsAmount(0)
		// 	})
		// }

		appSocket.on(socketEvents.newNotification, (payload: NotificationSocketEvent) => {
			console.log('new notification')
			console.log('This is payload', payload)
			if (payload.roomId !== id) return

			setLastMessage(payload.notif.message)
			setAuthor(createAuthor(payload.notif.creator, user))

			if (user.id !== payload.notif.creator.id && currentRoom.id !== payload.notif.room.id) {
				setRoomNotificaitonsAmount((prev) => prev + 1)
			} else {
				// appSocket.emit(socketEvents.markNotificationsAsRead, id)
			}
		})

		return () => {
			// appSocket.off(socketEvents.markNotificationsAsRead)
			appSocket.off(socketEvents.newNotification)
		}
	}, [appSocket, currentRoom])

	useEffect(() => {
		if (!appSocket) return

		if (currentRoom.id === id && roomNotificationsAmount > 0) {
			console.log('This is currentRoom.id', currentRoom.id)
			console.log('This is currentRoom.id === id', currentRoom.id === id)
			console.log('This is roomNotificationsAmount', roomNotificationsAmount)

			appSocket.emit(socketEvents.markNotificationsAsRead, id, (res: string) => {
				console.log('marking notif as read')
				if (res === 'ok') setRoomNotificaitonsAmount(0)
			})
		}

		return () => {
			// appSocket.off(socketEvents.markNotificationsAsRead)
			// appSocket.off(socketEvents.newNotification)
		}
	}, [currentRoom])

	return (
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

					<Typography noWrap>
						<Typography color="neutral" level="body-md">
							{author}
						</Typography>
						<Typography level="body-sm">{lastMessage?.text}</Typography>
					</Typography>
				</ListItemContent>
			</ListItem>
		</ListItemButton>
	)
}

const createAuthor = (author: UserI, user: UserI) => {
	return author.username === user.username ? 'You: ' : `${author.username}: `
}

export default RoomListItem
