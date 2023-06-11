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

const ChatPage = () => {
	return (
		<Grid container spacing={2} sx={{ flexGrow: 1 }}>
			<Grid item>
				<LeftMenu />
			</Grid>
			<Grid item>
				<ChatContainer />
			</Grid>
		</Grid>
	)
}

export default ChatPage
