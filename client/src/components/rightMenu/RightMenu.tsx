import { Card, Grid, Stack, Typography } from '@mui/material'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { appAxios } from '../../api/axios'
import { useEffect, useState } from 'react'
import { PostRoomI, RoomI, UserI } from '../../types/BE_entities.types'
import { Avatar } from '@mui/joy'
import { AxiosError } from 'axios'
import { useAuth } from '../../hooks/useAuth'
import { useSocket } from '../../hooks/useSocket'
import { socketEvents } from '../../websocket/socketEvents'
import { useUser } from '../../hooks/useUser'

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
	}, [accessToken])

	return (
		<Grid border={'2px solid blue'}>
			{users.map((user, i) => (
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
	const { appSocket, changeCurrentRoom, createNewRoom } = useSocket()

	const checkIfPrivateChatExists = () => {
		// console.log('This is user', user)
		// console.log('This is appSocket', appSocket)
		if (!user || !appSocket) return

		const newRoom: PostRoomI = {
			name: username,
			users: [id],
			isGroupChat: false,
		}

		// console.log('This is newRoom', newRoom)

		appSocket.emit(socketEvents.checkIfPrivateChatExists, id, (callBack: boolean | number) => {
			console.log('This is callBack', callBack)

			if (typeof callBack === 'number') {
				changeCurrentRoom(callBack)
			}

			if (typeof callBack === 'boolean') {
				createNewRoom(newRoom)
			}
		})
	}

	return (
		<Stack
			display={'flex'}
			flexDirection={'row'}
			alignItems={'center'}
			my={'1rem'}
			onClick={checkIfPrivateChatExists}
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
