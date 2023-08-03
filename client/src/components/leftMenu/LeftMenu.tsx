import { List, Typography } from '@mui/joy'
import { Grid } from '@mui/material'
import { useSocket } from '../../hooks/contextHooks'
import AppSpinner from '../AppSpinner'
import ConversationsListItem from './ConversationsListItem'
import { useRooms } from '../../hooks/contextHooks'

const longText =
	'Exercitation non ea enim elit do minim eu qui voluptate reprehenderit commodo. Eu laborum culpa quis veniam consectetur eu occaecat non aliqua incididunt. Irure non sit occaecat consectetur adipisicing exercitation est cupidatat veniam. Excepteur anim labore incididunt eu commodo velit culpa ipsum tempor. Laboris tempor eu deserunt occaecat qui esse. Proident ex proident sit et incididunt. Minim Lorem velit consequat mollit id irure exercitation culpa dolore nostrud fugiat eu cillum.'

const LeftMenu = () => {
	const { rooms } = useRooms()

	if (!rooms) return <AppSpinner text="Left menu" />

	return (
		<Grid container height={'100%'} direction={'column'} p={'.5rem'} bgcolor={'Menu'}>
			<Typography level="h4" mb={'1rem'} p={'1rem'}>
				Conversations
			</Typography>
			<Grid
				item
				overflow={'scroll'}
				display={'inline-block'}
				direction={'column'}
				maxWidth={''}
				width={'inherit'}
			>
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
						<ConversationsListItem {...room} key={room.id} />
					))}
				</List>
			</Grid>
		</Grid>
	)
}

export default LeftMenu
