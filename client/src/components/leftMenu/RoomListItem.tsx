import { ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'
import { ListItemButton, Stack } from '@mui/material'
import { useRooms, useSocket, useUser } from '../../hooks/contextHooks'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { setLeftDrawerState } from '../../redux/slices/drawer.slice'
import { markRoomNotifAsRead } from '../../redux/slices/notifications.slice'
import { TRoom } from '../../types/types'
import { socketEvents } from '../../utils/constants'
import { createAuthor, getReceivingUser } from '../../utils/helpers'
import AppBadge from '../AppBadge'
import AppSpinner from '../AppSpinner'
import TimeDisplay from '../TimeDisplay'
import AppAvatar from '../avatar/AppAvatar'

const RoomListItem: React.FC<TRoom> = ({ id, isGroupChat, name, users }) => {
	const dispatch = useAppDispatch()

	const { appSocket } = useSocket()
	const { currentRoom, changeCurrentRoom } = useRooms()
	const { user } = useUser()
	const notificationForRoom = useAppSelector((state) => state.notif[id])

	const onRoomClick = () => {
		dispatch(setLeftDrawerState(false))
		changeCurrentRoom(id)

		if (!notificationForRoom?.unreadNotificationsAmount) return
		if (!appSocket) return

		appSocket.emit(socketEvents.markNotificationsAsRead, id, (res: string) => {
			if (res === 'ok') dispatch(markRoomNotifAsRead(id))
		})
	}

	if (!currentRoom || !user) return <AppSpinner circle={false} text="Rooms" />

	const receivingUser = getReceivingUser(users, user.id)
	const conversationName = isGroupChat ? name : receivingUser.username

	return (
		<ListItemButton
			onClick={onRoomClick}
			selected={currentRoom.id === id}
			sx={{ width: 'inherit', flex: '1 0 auto', maxHeight: '72px' }}
		>
			<ListItem sx={{ width: 'inherit' }}>
				<ListItemDecorator sx={{ alignSelf: 'flex-start', mr: '.5rem' }}>
					<AppAvatar username={conversationName} imageUrl={receivingUser.profile?.avatar} />
				</ListItemDecorator>
				<ListItemContent>
					<Stack justifyContent={'space-between'} flexDirection={'row'}>
						<Typography display={'inline-block'} noWrap>
							{conversationName}
						</Typography>

						{notificationForRoom.lastMessage && (
							<span>
								<Typography display={'inline-block'} textAlign={'end'} level="body-sm" noWrap>
									<TimeDisplay date={notificationForRoom.lastMessage.created_at} />
									<AppBadge badgeContent={notificationForRoom.unreadNotificationsAmount} />
								</Typography>
							</span>
						)}
					</Stack>

					{notificationForRoom.lastMessage && (
						<Typography noWrap>
							<Typography color="neutral" level="body-md">
								{createAuthor(notificationForRoom.lastMessage.user, user)}
							</Typography>
							<Typography level="body-sm">{notificationForRoom.lastMessage.text}</Typography>
						</Typography>
					)}
				</ListItemContent>
			</ListItem>
		</ListItemButton>
	)
}

export default RoomListItem
