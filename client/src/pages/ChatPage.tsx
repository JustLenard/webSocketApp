import { Grid } from '@mui/material'
import ChatContainer from '../components/ChatContainer'
import Header from '../components/Header'
import LeftMenu from '../components/LeftMenu'
import RightMenu from '../components/RightMenu'

const ChatPage = () => {
	return (
		<Grid
			display={'flex'}
			justifyContent={'space-between'}
			container
			minHeight={'100vh'}
			border={'2px solid blue'}
		>
			<Grid xs={2} item>
				<LeftMenu />
			</Grid>
			<Grid xs={10} display={'flex'} direction={'column'}>
				<Header />
				<Grid
					display={'flex'}
					justifyContent={'space-between'}
					border={'2px solid red'}
					height={'100%'}
				>
					<ChatContainer />
					<RightMenu />
				</Grid>
			</Grid>
		</Grid>
	)
}

export default ChatPage
