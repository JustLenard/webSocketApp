import { Button, Grid, useMediaQuery, useTheme } from '@mui/material'
import AppNavbar from '../components/userMenu/AppNavbar'
import ChatPanel from '../components/chat/ChatPanel'
import LeftMenu from '../components/leftMenu/LeftMenu'
import RightMenu from '../components/rightMenu/RightMenu'
import MessagesProvider from '../providers/MessagesProvider'
import AppDrawer from '../components/drawer/AppDrawer'

const ChatPage = () => {
	const theme = useTheme()
	const upMdBreakpoint = useMediaQuery(theme.breakpoints.up('md'))
	const upLgBreakpoint = useMediaQuery(theme.breakpoints.up('lg'))

	return (
		<Grid
			sx={{
				minHeight: '100vh',
				height: '100vh',
			}}
		>
			<Grid container sx={{ width: '100%', height: '100%', flexWrap: 'nowrap' }}>
				{upMdBreakpoint && (
					<Grid
						item
						xs={4}
						lg={2}
						sx={{
							height: 'inherit',
						}}
					>
						<LeftMenu />
					</Grid>
				)}
				<Grid item xs>
					<MessagesProvider>
						<ChatPanel />
					</MessagesProvider>
				</Grid>
				{upLgBreakpoint && (
					<Grid
						item
						xs={0}
						lg={2}
						sx={{
							height: 'inherit',
						}}
					>
						<RightMenu />
					</Grid>
				)}
			</Grid>
		</Grid>
	)
}

export default ChatPage
