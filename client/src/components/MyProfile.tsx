import Button from '@mui/joy/Button'
import Menu from '@mui/joy/Menu'
import MenuItem from '@mui/joy/MenuItem'
import Avatar from '@mui/joy/Avatar'
import { MouseEvent, useContext, useState } from 'react'
import { Typography } from '@mui/material'
import AuthContext from '../context/AuthProvider'
import { useAuth } from '../hooks/useAuth'

const MyProfile = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const { logOut } = useAuth()
	const open = Boolean(anchorEl)

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleLogout = () => {
		logOut()
	}

	return (
		<div>
			<Button variant="outlined" color="neutral" onClick={handleClick}>
				<Typography>Dashboard</Typography>
				<Avatar size="sm">A</Avatar>
			</Button>
			<Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
				<MenuItem onClick={handleLogout}>Logout</MenuItem>
			</Menu>
		</div>
	)
}

export default MyProfile
