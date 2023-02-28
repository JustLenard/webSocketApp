import { Card, Divider, Grid } from '@mui/material'
import { Stack } from '@mui/system'
import RoomName from './RoomName'

const LeftMenu = () => {
	return (
		<Stack spacing={1} padding={1}>
			<RoomName />
			<RoomName />
			<RoomName />
		</Stack>
	)
}

export default LeftMenu
