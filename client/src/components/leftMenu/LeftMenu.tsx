import { List, Typography } from '@mui/joy'
import { Grid } from '@mui/material'
import { useSocket } from '../../hooks/contextHooks'
import AppSpinner from '../AppSpinner'
import RoomListItem from './RoomListItem'
import { useRooms } from '../../hooks/contextHooks'

const LeftMenu = () => {
	const { rooms } = useRooms()

	if (!rooms) return <AppSpinner text="Left menu" />

	return (
		<Grid container height={'100%'} direction={'column'} p={'.5rem'} bgcolor={'Menu'}>
			<Typography level="h4" mb={'1rem'} p={'1rem'}>
				Conversations
			</Typography>
			<Grid item overflow={'scroll'} display={'inline-block'} width={'inherit'}>
				<List
					variant={'outlined'}
					sx={{
						width: 'inherit',
						minWidth: 240,
						borderRadius: 'sm',
						boxShadow: 'sm',
						paddingLeft: 0,
						'--ListItem-paddingX': 0,
						'--ListItem-paddingY': 0,
						'--ListDivider-gap': '0px',
						'& [role="button"]': {},
					}}
				>
					{rooms.map((room, i) => (
						<RoomListItem {...room} key={room.id} />
					))}
				</List>
			</Grid>
		</Grid>
	)
}

export default LeftMenu
