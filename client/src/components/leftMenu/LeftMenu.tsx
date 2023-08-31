import { List, Typography } from '@mui/joy'
import { Grid } from '@mui/material'
import { useSocket, useUser } from '../../hooks/contextHooks'
import AppSpinner from '../AppSpinner'
import RoomListItem from './RoomListItem'
import { useRooms } from '../../hooks/contextHooks'
import UserMenu from '../header/UserMenu'
import { getRandomInt } from '../../utils/helpers'
import { useEffect } from 'react'
import { socketEvents } from '../../utils/constants'
import { NotificationSocketEvent } from '../../types/types'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { newNotification } from '../../redux/slices/notifications.slice'

const LeftMenu = () => {
	const { appSocket } = useSocket()
	const { rooms, currentRoom } = useRooms()
	const { user } = useUser()
	const dispatch = useAppDispatch()

	console.log('Left menu rerender')

	useEffect(() => {
		if (!appSocket || !user || !currentRoom) return

		appSocket.on(socketEvents.newNotification, (payload: NotificationSocketEvent) => {
			console.log('Received notification', payload)
			console.log('Creating nottification')
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
					scrollbarColor: 'red',
					// scrollbarWidth: 'none',
				}}
			>
				{rooms.map((room, i) => (
					<RoomListItem {...room} key={getRandomInt(1000)} />
				))}
				{rooms.map((room, i) => (
					<RoomListItem {...room} key={getRandomInt(1000)} />
				))}
				{rooms.map((room, i) => (
					<RoomListItem {...room} key={getRandomInt(1000)} />
				))}
				{rooms.map((room, i) => (
					<RoomListItem {...room} key={getRandomInt(1000)} />
				))}
			</List>
			<UserMenu />
		</Grid>
	)
}

export default LeftMenu
