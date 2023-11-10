import { Logout } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { Stack, Typography } from '@mui/joy'
import Avatar from '@mui/joy/Avatar'
import { IconButton, ListItemIcon, Menu, MenuItem, Paper } from '@mui/material'
import { MouseEvent, useState } from 'react'
import { useAuth, useUser } from '../../hooks/contextHooks'
import { getSubstring } from '../../utils/helpers'
import AppSpinner from '../AppSpinner'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { changeProfileModalState } from '../../redux/slices/modalStates.slice'

const UserMenu = () => {
	const { user } = useUser()
	const dispatch = useAppDispatch()

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

	const openProfileModal = () => {
		dispatch(changeProfileModalState(true))
	}

	if (!user) return <AppSpinner contained text="Getting user" />

	return (
		<Paper
			sx={{
				p: '.5rem',
				boxSizing: 'border-box',
				width: '100% !important',
			}}
		>
			<Stack direction={'row'} alignItems={'center'}>
				<Avatar size="md">{getSubstring(user.username)}</Avatar>
				<Typography ml={'1rem'} level="body-lg" noWrap>
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
				<MenuItem onClick={openProfileModal}>
					<ListItemIcon>
						<PersonOutlineIcon fontSize="small" />
					</ListItemIcon>
					My profile
				</MenuItem>
			</Menu>
		</Paper>
	)
}

export default UserMenu
