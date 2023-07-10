import { Stack } from '@mui/system'
import RoomName from './RoomName'
import { useContext } from 'react'
import { SocketContext } from '../../context/SocketProvider'
import { Skeleton } from '@mui/material'
import AppSpinner from '../AppSpinner'

const LeftMenu = () => {
	const { rooms } = useContext(SocketContext)

	if (!rooms) return <AppSpinner text="Left menu" />

	return (
		<Stack spacing={1} padding={1}>
			{rooms.map((room, i) => (
				<RoomName {...room} key={room.id} />
			))}
		</Stack>
	)
}

export default LeftMenu
