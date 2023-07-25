import { List, Typography } from '@mui/joy'
import { Grid } from '@mui/material'
import { useSocket } from '../../hooks/useSocket'
import AppSpinner from '../AppSpinner'
import ConversationsListItem from './ConversationsListItem'

const LeftMenu = () => {
	const { rooms } = useSocket()

	if (!rooms) return <AppSpinner text="Left menu" />

	return (
		<Grid container height={'100%'} direction={'column'} p={'.5rem'} bgcolor={'Menu'}>
			<Typography level="h4" mb={'1rem'} p={'1rem'}>
				Conversations
			</Typography>
			<Grid item overflow={'scroll'}>
				<List
					variant={'outlined'}
					sx={{
						minWidth: 240,
						borderRadius: 'sm',
						boxShadow: 'sm',
						'--ListItem-paddingY': 0,
						'--ListDivider-gap': '0px',
						'& [role="button"]': {
							// width: '80%',
							// borderRadius: '20px',
						},
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
