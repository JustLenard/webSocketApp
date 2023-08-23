import { List, Typography } from '@mui/joy'
import { Grid } from '@mui/material'
import { useSocket } from '../../hooks/contextHooks'
import AppSpinner from '../AppSpinner'
import RoomListItem from './RoomListItem'
import { useRooms } from '../../hooks/contextHooks'
import MyProfile from '../header/MyProfile'

const LeftMenu = () => {
	const { rooms } = useRooms()

	if (!rooms) return <AppSpinner text="Left menu" />

	return (
		<Grid
			container
			sx={{
				flexWrap: 'nowrap',
				p: '.5rem',
				bgcolor: 'Menu',
				flexDirection: 'column',
				height: '100%',
			}}
		>
			<Typography level="h4" mb={'1rem'} p={'1rem'}>
				Conversations
			</Typography>
			<Grid item overflow={'scroll'} display={'inline-block'} width={'inherit'}>
				<List
					variant={'outlined'}
					sx={{
						width: 'inherit',
						minWidth: 200,
						borderRadius: 'md',
						boxShadow: 'sm',
						'--ListItem-paddingX': 0,
						'--ListItem-paddingY': 0,
					}}
				>
					{rooms.map((room, i) => (
						<RoomListItem {...room} key={room.id} />
					))}
				</List>
			</Grid>
			<MyProfile />
		</Grid>
	)
}

export default LeftMenu
