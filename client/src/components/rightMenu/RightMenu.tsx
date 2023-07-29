import { Avatar, List, ListDivider, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'
import { Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRooms } from '../../hooks/contextHooks'
import { useAuth } from '../../hooks/contextHooks'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useUser } from '../../hooks/contextHooks'
import { CreateRoomParams, UserI } from '../../types/types'

const RightMenu = () => {
	const { privateAxios } = useAxiosPrivate()
	const { accessToken } = useAuth()
	const [users, setUsers] = useState<UserI[]>([])

	useEffect(() => {
		if (accessToken) {
			const getUsers = async () => {
				try {
					const response = await privateAxios.get('/users')
					console.log('This is response', response)

					setUsers(response.data)
				} catch (err) {
					console.log('This is err', err)
				}
			}
			getUsers()
		}
	}, [accessToken])

	// const onlineUsers = []
	const offlineUsers: UserI[] = []
	const onlineUsers: UserI[] = []
	users.map((user) => {
		user.online ? onlineUsers.push(user) : offlineUsers.push(user)
	})

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
					<Avatar src="/static/images/avatar/1.jpg" />
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
