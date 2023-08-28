import { Badge, Box, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'
import { ListItemButton, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRooms, useSocket, useUser } from '../../hooks/contextHooks'
import { NotificationSocketEvent, TNotification, TRoom, TUser } from '../../types/types'
import { socketEvents } from '../../utils/constants'
import { createAuthor, getReceivingUser, utcTimeToHumanTime } from '../../utils/helpers'
import AppSpinner from '../AppSpinner'
import AppAvatar from '../avatar/AppAvatar'
import AppBadge from '../AppBadge'
import { useAppSelector } from '../../hooks/reduxHooks'

const RoomListItem: React.FC<TRoom> = ({
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
	const simpleNotif = useAppSelector((state) => state.notif[id])

	// const [roomNotificationsAmount, setRoomNotificaitonsAmount] = useState(notifications.length)
	// const [author, setAuthor] = useState(lastMessageProp && user && createAuthor(lastMessageProp.user, user))
	// const [lastMessage, setLastMessage] = useState(lastMessageProp && lastMessageProp)
	// const [roomNotificationsAmount, setRoomNotificaitonsAmount] = useState(
	// 	simpleNotif ? simpleNotif.unreadNotificationsAmount : 0,
	// )

	// const [author, setAuthor] = useState(lastMessageProp && user && createAuthor(lastMessageProp.user, user))
	// const [lastMessage, setLastMessage] = useState(lastMessageProp && lastMessageProp)

	const handleClick = () => {
		changeCurrentRoom(id)
	}

	if (!currentRoom || !user) return <AppSpinner circle={false} text="Rooms" />

	const getLastMessageData = () => {
		if (simpleNotif) {
			return [
				createAuthor(simpleNotif.lastMessage.author, user),
				simpleNotif.lastMessage.messageText,
				simpleNotif.lastMessage.createdAt,
			]
		}
		if (lastMessageProp) {
			return [createAuthor(lastMessageProp.user, user), lastMessageProp.text, lastMessageProp.created_at]
		}
		return [null, null, null]
	}

	const [author, lastMessage, createdAt] = getLastMessageData()
	const roomNotificationsAmount = simpleNotif ? simpleNotif.unreadNotificationsAmount : 0
	const receivingUser = getReceivingUser(users, user.id)
	const conversationName = isGroupChat ? name : receivingUser.username

	// useEffect(() => {
	// 	if (!appSocket) return

	// 	if (currentRoom.id === id && roomNotificationsAmount > 0) {
	// 		console.log('This is currentRoom.id', currentRoom.id)
	// 		console.log('This is currentRoom.id === id', currentRoom.id === id)
	// 		console.log('This is roomNotificationsAmount', roomNotificationsAmount)

	// 		appSocket.emit(socketEvents.markNotificationsAsRead, id, (res: string) => {
	// 			console.log('marking notif as read')
	// 			if (res === 'ok') setRoomNotificaitonsAmount(0)
	// 		})
	// 	}

	// 	return () => {
	// 		// appSocket.off(socketEvents.markNotificationsAsRead)
	// 		// appSocket.off(socketEvents.newNotification)
	// 	}
	// }, [currentRoom])

	return (
		<ListItemButton
			onClick={handleClick}
			selected={currentRoom.id === id}
			sx={{ width: 'inherit', flex: '1 0 auto', maxHeight: '72px' }}
		>
			<ListItem sx={{ width: 'inherit' }}>
				<ListItemDecorator sx={{ alignSelf: 'flex-start', mr: '.5rem' }}>
					<AppAvatar username={conversationName} />
				</ListItemDecorator>
				<ListItemContent>
					<Stack justifyContent={'space-between'} flexDirection={'row'}>
						<Typography display={'inline-block'} noWrap>
							{conversationName}
						</Typography>

						{createdAt && (
							<span>
								<Typography display={'inline-block'} textAlign={'end'} level="body-sm" noWrap>
									{utcTimeToHumanTime(createdAt as Date)}
									<AppBadge badgeContent={roomNotificationsAmount} />
								</Typography>
							</span>
						)}
					</Stack>

					{author && lastMessage && (
						<Typography noWrap>
							<Typography color="neutral" level="body-md">
								{author as string}
							</Typography>
							<Typography level="body-sm">{lastMessage as string}</Typography>
						</Typography>
					)}
				</ListItemContent>
			</ListItem>
		</ListItemButton>
	)
}

export default RoomListItem
