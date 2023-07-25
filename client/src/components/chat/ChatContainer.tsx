import { Grid, Stack } from '@mui/material'
import { useSocket } from '../../hooks/useSocket'
import AppSpinner from '../AppSpinner'
import ChatInput from './ChatInput'
import MessagesContainer from './MessagesContainer'
import { Typography } from '@mui/joy'

const ChatContainer = () => {
	const { currentRoom } = useSocket()

	if (!currentRoom) return <AppSpinner contained text="Chat container" />

	return (
		<Grid container direction={'column'} height={'100%'}>
			<Grid
				item
				xs
				style={{
					flex: 0,
					background: 'gray',
					padding: '1rem',
				}}
			>
				<Typography level="h5">{currentRoom.name}</Typography>
			</Grid>
			<Grid item xs overflow={'scroll'}>
				<MessagesContainer />
			</Grid>
			<Grid p={'1rem'}>
				<ChatInput />
			</Grid>
		</Grid>
	)
}

export default ChatContainer
