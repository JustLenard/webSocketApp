import { Grid } from '@mui/material'
import AppNavbar from '../components/header/AppNavbar'
import ChatContainer from '../components/chat/ChatContainer'
import LeftMenu from '../components/leftMenu/LeftMenu'
import RightMenu from '../components/rightMenu/RightMenu'

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
