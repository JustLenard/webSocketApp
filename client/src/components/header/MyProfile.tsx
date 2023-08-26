import { Logout } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import { Stack, Typography } from '@mui/joy'
import Avatar from '@mui/joy/Avatar'
import { IconButton, ListItemIcon, Menu, MenuItem, Paper } from '@mui/material'
import { MouseEvent, useState } from 'react'
import { useAuth, useUser } from '../../hooks/contextHooks'
import { getSubstring } from '../../utils/helpers'
import AppSpinner from '../AppSpinner'

const MyProfile = () => {
	const { user } = useUser()

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const { logOutUser } = useAuth()
	const open = Boolean(anchorEl)

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleLogout = () => {
		logOutUser()
	}

	if (!user) return <AppSpinner contained text="Getting user" />

	return (
		<Paper
			sx={{
				p: '.5rem',
				boxSizing: 'border-box',
			}}
		>
			<Stack direction={'row'} alignItems={'center'}>
				<Avatar size="md">{getSubstring(user.username)}</Avatar>
				<Typography ml={'1rem'} level="body-lg">
					{user.username}
				</Typography>
				<IconButton
					onClick={handleClick}
					sx={{
						ml: 'auto',
					}}
				>
					<MenuIcon />
				</IconButton>
			</Stack>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					horizontal: 'right',
					vertical: 'top',
				}}
			>
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</Paper>
	)
}

export default MyProfile
