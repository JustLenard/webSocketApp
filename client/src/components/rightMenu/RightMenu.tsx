import { Avatar, Typography } from '@mui/joy'
import { Grid, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useSocket } from '../../hooks/useSocket'
import { useUser } from '../../hooks/useUser'
import { UserI } from '../../types/BE_entities.types'
import { CreateRoomParams } from '../../types/types'

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
	const oflineUsers: UserI[] = []
	const onlineUsers: UserI[] = []
	users.map((user) => {
		user.online ? onlineUsers.push(user) : oflineUsers.push(user)
	})

	return (
		<Grid border={'2px solid blue'} sx={{ height: '100%' }} p={'1rem'}>
			<Typography level="h4" mb={'2rem'}>
				Participants
			</Typography>

			<Typography level="h6">{`Online - (${onlineUsers.length})`}</Typography>
			{onlineUsers.map((user, i) => (
				<ProfileItem id={user.id} username={user.username} key={user.id} />
			))}
			<Typography level="h6">{`Ofline - (${onlineUsers.length})`}</Typography>
			{oflineUsers.map((user, i) => (
				<ProfileItem id={user.id} username={user.username} key={user.id} />
			))}
		</Grid>
	)
}

interface ProfileItemProps {
	id: string
	username: string
}

const ProfileItem: React.FC<ProfileItemProps> = ({ id, username }) => {
	const { user } = useUser()
	const { privateAxios } = useAxiosPrivate()
	const { appSocket, changeCurrentRoom, createNewRoom } = useSocket()

	const handleClick = () => {
		const newRoom: CreateRoomParams = {
			name: `${user?.username}-${username}`,
			users: [id],
			isGroupChat: false,
		}

		createNewRoom(newRoom)
	}

	return (
		<Stack
			display={'flex'}
			flexDirection={'row'}
			alignItems={'center'}
			my={'1rem'}
			onClick={handleClick}
			sx={{
				cursor: 'pointer',
			}}
		>
			<Avatar size="sm">{username[0].toUpperCase()}</Avatar>

			<Typography pl={'1rem'}>{username}</Typography>
		</Stack>
	)
}

export default RightMenu
