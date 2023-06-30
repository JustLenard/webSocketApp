import { Button, FormControl, FormLabel, Grid, Input, Stack } from '@mui/material'
import ChatContainer from '../components/ChatContainer'
import Header from '../components/Header'
import LeftMenu from '../components/LeftMenu'
import RightMenu from '../components/RightMenu'
import { useContext } from 'react'
import AuthContext from '../auth/AuthProvider'
import { SocketContext } from '../websocket/SocketProvider'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IRoom } from '../types/room.type'
import AppNavbar from '../components/AppNavbar'

const ChatPage = () => {
	return (
		<Grid sx={{ border: '1px solid blue', minHeight: '100vh', height: '100vh' }}>
			<Grid item pb={'1rem'}>
				<AppNavbar />
			</Grid>
			<Grid
				container
				spacing={2}
				sx={{ height: '100%', border: '1px solid green', width: '100%', marginTop: '0', marginLeft: '0' }}
			>
				<Grid item xs={2}>
					<LeftMenu />
				</Grid>
				<Grid item xs>
					<ChatContainer />
				</Grid>
				<Grid item xs={2}>
					<RightMenu />
				</Grid>
			</Grid>
		</Grid>
	)
}

export default ChatPage
