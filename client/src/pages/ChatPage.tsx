import { Button, FormControl, FormLabel, Grid, Input } from '@mui/material'
import ChatContainer from '../components/ChatContainer'
import Header from '../components/Header'
import LeftMenu from '../components/LeftMenu'
import RightMenu from '../components/RightMenu'
import { useContext } from 'react'
import AuthContext from '../auth/AuthProvider'
import { SocketContext } from '../websocket/SocketProvider'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IRoom } from '../types/room.type'

type ChatForm = {
	message: string
}

const ChatPage = () => {
	const { logOut } = useContext(AuthContext)

	const { appSocket } = useContext(SocketContext)
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		resetField,
	} = useForm<ChatForm>()

	const handleMessageSubmit: SubmitHandler<ChatForm> = (message) => {
		console.log('This is message', message)

		appSocket?.emit('sendMessage', message, (callback: string) => console.log(callback))
		resetField('message')
	}

	const createRoom = () => {
		const newRoom: IRoom = {
			name: 'First room',
			users: [],
		}

		appSocket?.emit('createRoom', newRoom)
	}

	return (
		<Grid container spacing={2} sx={{ flexGrow: 1 }}>
			<Grid item>
				<LeftMenu />
			</Grid>
			<div>
				{/* <Header /> */}
				<div>
					{/* <ChatContainer />
					<RightMenu /> */}
					chat
				</div>
			</div>
			<form onSubmit={handleSubmit(handleMessageSubmit)}>
				<FormControl>
					{/* <FormLabel disabled>Username</FormLabel> */}
					<Input placeholder="Your message... " {...register('message')} />
				</FormControl>
				<Button type="submit">Submit</Button>
			</form>

			<Button onClick={createRoom}>Create Room</Button>

			<Button onClick={logOut}>Logout</Button>
		</Grid>
	)
}

export default ChatPage
