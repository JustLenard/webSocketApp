import { Avatar, List, ListDivider, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'
import { Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRooms, useSocket } from '../../hooks/contextHooks'
import { useAuth } from '../../hooks/contextHooks'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useUser } from '../../hooks/contextHooks'
import { CreateRoomParams, UserI } from '../../types/types'
import { socketEvents } from '../../utils/constants'

const RightMenu = () => {
	const { appSocket } = useSocket()
	const { privateAxios } = useAxiosPrivate()
	const { accessToken } = useAuth()

	const [offlineUsers, setOfflineUsers] = useState<UserI[]>([])
	const [onlineUsers, setOnlineUsers] = useState<UserI[]>([])

	useEffect(() => {
		if (accessToken) {
			const getUsers = async () => {
				try {
					const response = await privateAxios.get('/users')
					console.log('This is users response', response.data)

					const offUsers: UserI[] = []
					const onUsers: UserI[] = []

					response.data.map((user: UserI) => {
						user.online ? onUsers.push(user) : offUsers.push(user)
					})
					setOfflineUsers(offUsers)
					setOnlineUsers(onUsers)
				} catch (err) {
					console.log('This is err', err)
				}
			}
			getUsers()
		}
	}, [accessToken])

	useEffect(() => {
		if (!appSocket) return
		appSocket.on(socketEvents.userConnected, (user: UserI) => {
			console.log('User connect ', user)
			setOfflineUsers((prev) => prev.filter((item) => item.id !== user.id))
			setOnlineUsers((prev) => [...prev, user])
		})
		appSocket.on(socketEvents.userDisconnected, (user: UserI) => {
			console.log('User disconnected ', user)
			setOnlineUsers((prev) => prev.filter((item) => item.id !== user.id))
			setOfflineUsers((prev) => [...prev, user])
		})

		return () => {
			appSocket.off(socketEvents.userConnected)
			appSocket.off(socketEvents.userDisconnected)
		}
	}, [appSocket, offlineUsers, onlineUsers])

	return (
		<Grid container sx={{ height: '100%' }} p={'.5rem'} direction={'column'} bgcolor={'Menu'}>
			<Typography level="h4" mb={'1rem'} p={'1rem'}>
				Users
			</Typography>
			<Grid item overflow={'scroll'}>
				<Typography level="h6" mb={'1rem'}>{`Online - (${onlineUsers.length})`}</Typography>
				{onlineUsers.length !== 0 && (
					<List
						variant={'outlined'}
						sx={{
							minWidth: 240,
							borderRadius: 'sm',
							boxShadow: 'sm',
						}}
					>
						{onlineUsers.map((user, i) => (
							<ProfileListItem id={user.id} username={user.username} key={user.id} />
						))}
					</List>
				)}
				<Typography level="h6" mb={'1rem'}>{`Offline - (${offlineUsers.length})`}</Typography>
				{offlineUsers.length !== 0 && (
					<List
						variant={'outlined'}
						sx={{
							minWidth: 240,
							borderRadius: 'sm',
							boxShadow: 'sm',
							'--ListItem-paddingY': 0,
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

		createNewRoom(newRoom)
	}

	return (
		<>
			<ListItem onClick={handleClick}>
				<ListItemDecorator sx={{ alignSelf: 'flex-start', mr: '.5rem' }}>
					{/* <Avatar size="sm">{username[0].toUpperCase()}</Avatar> */}
					<Avatar />
				</ListItemDecorator>

				<ListItemContent>
					<Typography>{username}</Typography>
				</ListItemContent>
			</ListItem>
			<ListDivider inset={'gutter'} />
		</>
	)
}

export default RightMenu
