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
			}}
		>
			{/* <Grid item>
				<AppNavbar />
			</Grid> */}

			<Grid container sx={{ width: '100%', height: '100%', border: '2px solid red' }}>
				<Grid width={'60px'}>
					<div>User </div>
				</Grid>
				<Grid
					item
					xs={2}
					sx={{
						border: '2px solid green',
						height: 'inherit',
					}}
				>
					<LeftMenu />
				</Grid>
				<Grid item xs>
					<MessagesProvider>
						<ChatPanel />
					</MessagesProvider>
				</Grid>
				<Grid
					item
					xs={2}
					sx={{
						border: '2px solid green',
						height: 'inherit',
					}}
				>
					<RightMenu />
				</Grid>
			</Grid>
		</Grid>
	)
}

export default ChatPage
