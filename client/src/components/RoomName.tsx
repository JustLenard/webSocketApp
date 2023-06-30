import { Avatar, Card } from '@mui/material'
import { Stack } from '@mui/system'
import { IRoom } from '../types/room.type'
import { useContext } from 'react'
import { SocketContext } from '../websocket/SocketProvider'

interface Props {
	name: string
}

const RoomName: React.FC<Props & IRoom> = ({ name, id }) => {
	const { selectCurrentRoom, appSocket } = useContext(SocketContext)

	const handleClick = () => {
		selectCurrentRoom(id)
		appSocket?.emit('joinRoom', {
			id,
		})
	}

	return (
		<Stack
			onClick={handleClick}
			display={'flex'}
			direction={'row'}
			border={'1px solid red'}
			padding={0.5}
			borderRadius={2}
		>
			<Avatar>H</Avatar>
			<Stack display={'flex'} justifyContent={'center'} flexGrow={1} marginLeft={3}>
				{name}
			</Stack>
		</Stack>
	)
}

export default RoomName
