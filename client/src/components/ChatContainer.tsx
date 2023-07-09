import { Grid, Stack } from '@mui/material'
import { useSocket } from '../hooks/useSocket'
import AppSpinner from './AppLoading'
import ChatInput from './ChatInput'
import MessageContainer from './MessageContainer'

const ChatContainer = () => {
	const { currentRoom } = useSocket()

	if (!currentRoom) return <AppSpinner contained />

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
				<Stack display={'flex'} justifyContent={'space-between'} direction={'row'}>
					{currentRoom.name}

					<div>
						{currentRoom.users?.map((user) => (
							<div key={user.id}>{user.username}</div>
						))}
					</div>
				</Stack>
			</Grid>
			<Grid
				item
				xs
				height={'100%'}
				style={{
					border: '1px solid red',
				}}
			>
				<MessageContainer />
			</Grid>
			<Grid>
				<ChatInput />
			</Grid>
		</Grid>
	)
}

export default ChatContainer
