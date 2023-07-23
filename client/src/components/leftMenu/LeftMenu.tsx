import { Stack } from '@mui/system'
import { useSocket } from '../../hooks/useSocket'
import AppSpinner from '../AppSpinner'
import RoomName from './RoomName'
import { Grid } from '@mui/material'
import { Typography } from '@mui/joy'

const LeftMenu = () => {
	const { rooms } = useSocket()

	if (!rooms) return <AppSpinner text="Left menu" />

	return (
		<Grid border={'2px solid blue'} sx={{ height: '100%' }} p={'1rem'}>
			<Typography level="h4" mb={'2rem'}>
				Conversations
			</Typography>
			<Stack spacing={1}>
				{rooms.map((room, i) => (
					<RoomName {...room} key={room.id} />
				))}
			</Stack>
		</Grid>
	)
}

export default LeftMenu
