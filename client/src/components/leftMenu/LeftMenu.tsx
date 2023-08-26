import { List, Typography } from '@mui/joy'
import { Grid } from '@mui/material'
import { useSocket } from '../../hooks/contextHooks'
import AppSpinner from '../AppSpinner'
import RoomListItem from './RoomListItem'
import { useRooms } from '../../hooks/contextHooks'
import UserMenu from '../header/UserMenu'
import { getRandomInt } from '../../utils/helpers'

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
				height: 'calc(100vh - .5rem)',
			}}
		>
			<Typography level="h4" mb={'1rem'} p={'1rem'} flex={'0 0 auto'}>
				Conversations
			</Typography>

			<List
				variant={'outlined'}
				sx={{
					width: 'inherit',
					minWidth: 200,
					borderRadius: 'md',
					boxShadow: 'sm',
					'--ListItem-paddingX': 0,
					'--ListItem-paddingY': 0,
					overflow: 'scroll',
					mb: '1rem',
				}}
			>
				{/* {rooms.map((room, i) => (
						<RoomListItem {...room} key={room.id} />
					))} */}
				{rooms.map((room, i) => (
					<RoomListItem {...room} key={getRandomInt(1000)} />
				))}
			</List>
			<UserMenu />
		</Grid>
	)
}

export default LeftMenu
