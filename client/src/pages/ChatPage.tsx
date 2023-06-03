import { Button, Grid } from '@mui/material'
import ChatContainer from '../components/ChatContainer'
import Header from '../components/Header'
import LeftMenu from '../components/LeftMenu'
import RightMenu from '../components/RightMenu'
import { useContext } from 'react'
import AuthContext from '../auth/AuthProvider'

const ChatPage = () => {
	const { logOut } = useContext(AuthContext)
	return (
		<div>
			<div>{/* <LeftMenu /> */}</div>
			<div>
				{/* <Header /> */}
				<div>
					{/* <ChatContainer />
					<RightMenu /> */}
					chat
				</div>
			</div>

			<Button onClick={logOut}>Logout</Button>
		</div>
	)
}

export default ChatPage
