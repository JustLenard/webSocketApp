import { Button, Grid } from '@mui/material'
import AppNavbar from '../components/header/AppNavbar'
import ChatPanel from '../components/chat/ChatPanel'
import LeftMenu from '../components/leftMenu/LeftMenu'
import RightMenu from '../components/rightMenu/RightMenu'
import MessagesProvider from '../providers/MessagesProvider'
import AppDrawer from '../components/drawer/AppDrawer'

const ChatPage = () => {
	return (
		<Grid
			sx={{
				minHeight: '100vh',
				height: '100vh',
			}}
		>
			<Grid container sx={{ width: '100%', height: '100%', flexWrap: 'nowrap' }}>
				<Grid
					item
					xs={3}
					lg={2}
					sx={{
						height: 'inherit',
						display: {
							xs: 'none',
							md: 'initial',
						},
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
					xs={0}
					lg={2}
					sx={{
						height: 'inherit',
						display: {
							xs: 'none',
							lg: 'initial',
						},
					}}
				>
					<RightMenu />
				</Grid>
			</Grid>
		</Grid>
	)
}

export default ChatPage
