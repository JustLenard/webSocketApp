import { Grid } from '@mui/material'
import AppNavbar from '../components/header/AppNavbar'
import ChatPanel from '../components/chat/ChatPanel'
import LeftMenu from '../components/leftMenu/LeftMenu'
import RightMenu from '../components/rightMenu/RightMenu'
import MessagesProvider from '../providers/MessagesProvider'

const ChatPage = () => {
	return (
		<Grid
			sx={{
				minHeight: '100vh',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Grid item>
				<AppNavbar />
			</Grid>
			<Grid container sx={{ width: '100%', height: '100%' }}>
				<Grid item xs={2}>
					<LeftMenu />
				</Grid>
				<Grid item xs>
					<MessagesProvider>
						<ChatPanel />
					</MessagesProvider>
				</Grid>
				<Grid item xs={2}>
					<RightMenu />
				</Grid>
			</Grid>
		</Grid>
	)
}

export default ChatPage
