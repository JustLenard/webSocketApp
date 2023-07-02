import { Box, Button, FormControl, Grid, Input, OutlinedInput } from '@mui/material'
import { useContext, useEffect } from 'react'
import { Form } from 'react-router-dom'
import { apiRequest } from '../utils/apiRequest'
import ChatInput from './ChatInput'
import AuthContext from '../auth/AuthProvider'
import { SocketContext } from '../websocket/SocketProvider'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IRoom } from '../types/room.type'
import MessageContainer from './MessageContainer'

const ChatContainer = () => {
	const { logOut } = useContext(AuthContext)

	const { appSocket, sendMessage } = useContext(SocketContext)

	return (
		<>
			<Grid container direction={'column'} height={'100%'}>
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

			{/* <Button onClick={createRoom}>Create Room</Button>

			<Button onClick={logOut}>Logout</Button> */}
		</>
	)
}

export default ChatContainer
