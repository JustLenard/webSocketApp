import { Card, Grid, Stack, Typography } from '@mui/material'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { axiosPrivate } from '../api/axios'
import { useEffect, useState } from 'react'
import { CreateRoomI, RoomI, UserI } from '../types/BE_entities.types'
import { Avatar } from '@mui/joy'
import { AxiosError } from 'axios'
import { useAuth } from '../hooks/useAuth'
import { useSocket } from '../hooks/useSocket'

const RightMenu = () => {
	const appAxios = useAxiosPrivate()

	const { accessToken } = useAuth()

	const [users, setUsers] = useState<UserI[]>([])

	useEffect(() => {
		if (accessToken) {
			const getUsers = async () => {
				try {
					const response = await appAxios.get('/users')

					setUsers(response.data)
				} catch (err) {
					console.log('This is err', err)
				}
			}
			getUsers()
		}
	}, [])

	return (
		<Grid border={'2px solid blue'}>
			{users.map((user, i) => (
				<ProfileItem id={user.id} username={user.username} key={user.id} />
			))}
		</Grid>
	)
}

interface ProfileItemProps {
	id: number
	username: string
}

const ProfileItem: React.FC<ProfileItemProps> = ({ id, username }) => {
	const { user } = useAuth()
	const { appSocket } = useSocket()

	const createRoom = () => {
		if (!user || !appSocket) return

		const newRoom: CreateRoomI = {
			name: username,
			users: [id, user.id],
		}

		appSocket.emit('createRoom', newRoom)
	}

	return (
		<Stack display={'flex'} flexDirection={'row'} alignItems={'center'} my={'1rem'}>
			<Avatar size="sm">{username[0].toUpperCase()}</Avatar>

			<Typography pl={'1rem'}>{username}</Typography>
		</Stack>
	)
}

export default RightMenu
