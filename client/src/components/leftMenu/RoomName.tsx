import { Avatar, Card } from '@mui/material'
import { Stack } from '@mui/system'
import { IRoom } from '../../types/room.type'
import { useContext } from 'react'
import { SocketContext } from '../../context/SocketProvider'
import { RoomI } from '../../types/BE_entities.types'
import { useUser } from '../../hooks/useUser'
import { getReceivingUser } from '../../utils/utils'
import { useSocket } from '../../hooks/useSocket'
import AppSpinner from '../AppSpinner'
import { Typography } from '@mui/joy'

const RoomName: React.FC<RoomI> = ({ id, isGroupChat, name, users, description, lastMessage }) => {
	const { currentRoom, changeCurrentRoom, appSocket } = useContext(SocketContext)
	const { user } = useUser()

	const handleClick = () => {
		changeCurrentRoom(id)
	}

	if (!currentRoom || !user) return <AppSpinner circle={false} />

	const receivingUser = getReceivingUser(users, user.id)

	return (
		<Stack
			onClick={handleClick}
			display={'flex'}
			direction={'row'}
			border={'1px solid red'}
			p={'.5rem'}
			// width={'100px'}
			borderRadius={2}
		>
			{isGroupChat ? (
				<RenderRoom name={name} lastMessage={lastMessage} />
			) : (
				<RenderRoom name={receivingUser.username} lastMessage={lastMessage} />
			)}
		</Stack>
	)
}

const longText =
	'Eu adipisicing duis in veniam non occaecat irure. Culpa irure deserunt anim enim laboris commodo amet ex minim adipisicing est amet. Nulla velit sit et amet excepteur magna sit occaecat sunt cillum labore. Est ullamco exercitation do in dolore. Mollit duis labore non id incididunt fugiat ut adipisicing tempor qui elit velit.'

const RenderRoom: React.FC<Partial<RoomI>> = ({ name, lastMessage }) => {
	return (
		<>
			<Avatar sx={{ alignSelf: 'center' }}> H</Avatar>
			<Stack display={'flex'} justifyContent={'center'} flexGrow={1} marginLeft={1}>
				<Typography>{name}</Typography>
				{/* <Typography>{lastMessage?.text}</Typography> */}
				<Typography noWrap width={'100%'}>
					{longText}
				</Typography>
			</Stack>
		</>
	)
}

export default RoomName
