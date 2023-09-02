import { List, ListDivider, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'
import { Grid, ListItemButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRooms, useSocket, useUser } from '../../hooks/contextHooks'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { CreateRoomParams, TUser } from '../../types/types'
import { socketEvents } from '../../utils/constants'
import { handleError } from '../../utils/handleAxiosErrors'
import AppAvatar from '../avatar/AppAvatar'

const RightMenu = () => {
	const { appSocket } = useSocket()
	const { privateAxios } = useAxiosPrivate()

	const [offlineUsers, setOfflineUsers] = useState<TUser[]>([])
	const [onlineUsers, setOnlineUsers] = useState<TUser[]>([])

	/**
	 * Get users. Separate them into offline and online
	 **/
	useEffect(() => {
		const getUsers = async () => {
			try {
				const response = await privateAxios.get('/users')

				const offUsers: TUser[] = []
				const onUsers: TUser[] = []

				response.data.forEach((user: TUser) => {
					if (!user.online) return offUsers.push(user)
					if (user.online && !onlineUsers.find((onUser) => onUser.id === user.id)) onUsers.push(user)
				})
				setOfflineUsers(offUsers)
				setOnlineUsers(onUsers)
			} catch (err) {
				handleError(err)
			}
		}
		getUsers()
	}, [])

	/**
	 * Listen to events of user going online / offline
	 **/
	useEffect(() => {
		if (!appSocket) return
		appSocket.on(socketEvents.userConnected, (user: TUser) => {
			if (onlineUsers.find((onlineUser) => onlineUser.id === user.id)) return

			setOfflineUsers((prev) => prev.filter((item) => item.id !== user.id))

			setOnlineUsers((prev) => [...prev, user])
		})
		appSocket.on(socketEvents.userDisconnected, (user: TUser) => {
			if (offlineUsers.find((offlineUser) => offlineUser.id === user.id)) return

			setOnlineUsers((prev) => prev.filter((item) => item.id !== user.id))
			setOfflineUsers((prev) => [...prev, user])
		})

		return () => {
			appSocket.off(socketEvents.userConnected)
			appSocket.off(socketEvents.userDisconnected)
		}
	}, [appSocket, onlineUsers, offlineUsers])

	return (
		<Grid
			container
			sx={{
				flexWrap: 'nowrap',
				p: '.5rem',
				bgcolor: 'Menu',
				flexDirection: 'column',
				height: '100%',
			}}
		>
			<Typography level="h4" mb={'1rem'} p={'1rem'}>
				Users
			</Typography>
			<Grid item overflow={'scroll'}>
				<Typography level="title-md" mb={'1rem'}>{`Online - (${onlineUsers.length})`}</Typography>
				{onlineUsers.length !== 0 && (
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
						{onlineUsers.map((user, i) => (
							<ProfileListItem id={user.id} username={user.username} key={user.id} />
						))}
					</List>
				)}
				<Typography level="title-md" my={'1rem'}>{`Offline - (${offlineUsers.length})`}</Typography>
				{offlineUsers.length !== 0 && (
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
						{offlineUsers.map((user, i) => (
							<ProfileListItem id={user.id} username={user.username} key={user.id} />
						))}
					</List>
				)}
			</Grid>
		</Grid>
	)
}

interface ProfileItemProps {
	id: string
	username: string
}

const ProfileListItem: React.FC<ProfileItemProps> = ({ id, username }) => {
	const { user } = useUser()
	const { createNewRoom } = useRooms()

	const handleClick = () => {
		const newRoom: CreateRoomParams = {
			name: `${user?.username}-${username}`,
			users: [id],
			isGroupChat: false,
		}

		console.log('This is newRoom', newRoom)

		createNewRoom(newRoom)
	}

	return (
		<>
			<ListItemButton onClick={handleClick}>
				<ListItem>
					<ListItemDecorator sx={{ alignSelf: 'flex-start', mr: '.5rem' }}>
						<AppAvatar username={username} />
					</ListItemDecorator>

					<ListItemContent>
						<Typography>{username}</Typography>
					</ListItemContent>
				</ListItem>
			</ListItemButton>
			{/* <ListDivider
				inset={'gutter'}
				sx={{
					marginY: 0,
					marginX: 0,
				}}
			/> */}
		</>
	)
}

export default RightMenu
