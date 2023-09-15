import { List, Typography } from '@mui/joy'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { useRooms, useSocket } from '../../hooks/contextHooks'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { newNotification } from '../../redux/slices/notifications.slice'
import { NotificationSocketEvent } from '../../types/types'
import { socketEvents } from '../../utils/constants'
import AppSpinner from '../AppSpinner'
import UserMenu from '../userMenu/UserMenu'
import RoomListItem from './RoomListItem'

const LeftMenu = () => {
	const { appSocket } = useSocket()
	const { rooms, currentRoom } = useRooms()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!appSocket || !currentRoom) return

		appSocket.on(socketEvents.newNotification, (payload: NotificationSocketEvent) => {
			console.log('Received notification', payload)
			dispatch(newNotification({ ...payload, incrementNotifCount: currentRoom.id !== payload.roomId }))
		})

		return () => {
			appSocket.off(socketEvents.newNotification)
		}
	}, [currentRoom])

	if (!rooms) return <AppSpinner text="Left menu" />

	return (
		<Grid
			container
			sx={{
				flexWrap: 'nowrap',
				p: '.5rem',
				bgcolor: 'Menu',
				flexDirection: 'column',
				height: 'calc(100vh - .5rem)',
			}}
		>
			<Typography level="h4" mb={'1rem'} p={'1rem'} flex={'0 0 auto'}>
				Conversations
			</Typography>

			<List
				variant={'outlined'}
				sx={{
					width: 'inherit',
					minWidth: 200,
					borderRadius: 'md',
					boxShadow: 'sm',
					'--ListItem-paddingX': 0,
					'--ListItem-paddingY': 0,
					overflow: 'scroll',
					mb: '1rem',
				}}
			>
				{rooms.map((room) => (
					<RoomListItem {...room} key={room.id} />
				))}
			</List>
			<UserMenu />
		</Grid>
	)
}

export default LeftMenu
