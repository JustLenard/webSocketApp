import { Card, Grid, Stack, Typography } from '@mui/material'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { appAxios } from '../../api/axios'
import { useEffect, useState } from 'react'
import { PostRoomI, RoomI, UserI } from '../../types/BE_entities.types'
import { Avatar } from '@mui/joy'
import { AxiosError } from 'axios'
import { useAuth } from '../../hooks/useAuth'
import { useSocket } from '../../hooks/useSocket'
import { socketEvents } from '../../utils/constants'
import { useUser } from '../../hooks/useUser'
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

	// const checkIfPrivateChatExists = async () => {
	// 	if (!user || !appSocket) return

	// 	const response = await privateAxios.post('/rooms', newRoom)

	// 	console.log('This is response.data', response.data)

	// 	if (typeof response.data === 'number') {
	// 		changeCurrentRoom(response)
	// 	}

	// 	if (typeof response.data === 'boolean') {
	// 		createNewRoom(newRoom)
	// 	}

	// 	// appSocket.emit(socketEvents.checkIfPrivateChatExists, id, (callBack: boolean | number) => {
	// 	// 	console.log('This is callBack', callBack)

	// 	// })
	// }

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
