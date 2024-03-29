import { List, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'
import { Grid, ListItemButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRooms, useSocket, useUser } from '../../hooks/contextHooks'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { CreateRoomParams } from '../../types/types'
import { IOnlinseUser, IShortUser } from '../../types/interfaces'
import { socketEvents } from '../../utils/constants'
import { handleError } from '../../utils/handleAxiosErrors'
import AppAvatar from '../avatar/AppAvatar'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { setRightDrawerState } from '../../redux/slices/drawer.slice'

const RightMenu = () => {
	const { appSocket } = useSocket()
	const { privateAxios } = useAxiosPrivate()

	const [offlineUsers, setOfflineUsers] = useState<IOnlinseUser[]>([])
	const [onlineUsers, setOnlineUsers] = useState<IOnlinseUser[]>([])

	/**
	 * Get users. Separate them into offline and online
	 **/
	useEffect(() => {
		const getUsers = async () => {
			try {
				const response = await privateAxios.get('/users')

				const offUsers: IOnlinseUser[] = []
				const onUsers: IOnlinseUser[] = []

				response.data.forEach((user: IOnlinseUser) => {
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
		appSocket.on(socketEvents.userConnected, (user: IOnlinseUser) => {
			if (onlineUsers.find((onlineUser) => onlineUser.id === user.id)) return

			setOfflineUsers((prev) => prev.filter((item) => item.id !== user.id))

			setOnlineUsers((prev) => [...prev, user])
		})
		appSocket.on(socketEvents.userDisconnected, (user: IOnlinseUser) => {
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
						{onlineUsers.map((user) => (
							<ProfileListItem
								id={user.id}
								username={user.username}
								key={user.id}
								imageUrl={user.imageUrl}
							/>
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
						{offlineUsers.map((user) => (
							<ProfileListItem
								id={user.id}
								username={user.username}
								key={user.id}
								imageUrl={user.imageUrl}
							/>
						))}
					</List>
				)}
			</Grid>
		</Grid>
	)
}

const ProfileListItem: React.FC<IShortUser> = ({ id, username, imageUrl }) => {
	const dispatch = useAppDispatch()
	const { user } = useUser()
	const { createNewRoom } = useRooms()

	const handleClick = () => {
		dispatch(setRightDrawerState(false))
		if (user?.id === id) return
		const newRoom: CreateRoomParams = {
			name: `${user?.username}-${username}`,
			users: [id],
			isGroupChat: false,
		}

		createNewRoom(newRoom)
	}

	return (
		<ListItemButton onClick={handleClick}>
			<ListItem>
				<ListItemDecorator sx={{ alignSelf: 'flex-start', mr: '.5rem' }}>
					<AppAvatar username={username} imageUrl={imageUrl} />
				</ListItemDecorator>

				<ListItemContent>
					<Typography>{username}</Typography>
				</ListItemContent>
			</ListItem>
		</ListItemButton>
	)
}

export default RightMenu
