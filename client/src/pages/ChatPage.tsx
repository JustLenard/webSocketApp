import { Grid } from '@mui/material'
import AppNavbar from '../components/header/AppNavbar'
import ChatContainer from '../components/chat/ChatContainer'
import LeftMenu from '../components/leftMenu/LeftMenu'
import RightMenu from '../components/rightMenu/RightMenu'

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
			<Grid container sx={{ height: '100%', width: '100%' }}>
				<Grid item xs={2}>
					<LeftMenu />
				</Grid>
				<Grid
					item
					xs
					sx={{
						display: 'inline-flex',
					}}
				>
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
