import { Stack } from '@mui/system'
import RoomName from './RoomName'
import { useContext } from 'react'
import { SocketContext } from '../websocket/SocketProvider'
import { Skeleton } from '@mui/material'
import AppLoading from './AppLoading'

const LeftMenu = () => {
	const { rooms } = useContext(SocketContext)

	if (!rooms) return <AppLoading />

	return (
		<Stack spacing={1} padding={1}>
			{rooms.map((room, i) => (
				<RoomName {...room} key={room.id} />
			))}
		</Stack>
	)
}

export default LeftMenu
