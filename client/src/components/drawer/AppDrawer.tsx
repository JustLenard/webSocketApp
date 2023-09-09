import MenuIcon from '@mui/icons-material/Menu'
import { IconButton } from '@mui/material'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { setLeftDrawerState, setRightDrawerState } from '../../redux/slices/drawer.slice'
import { Drawers } from '../../types/types'

interface Props {
	children: ReactNode
	direction: Drawers
}

const AppDrawer: React.FC<Props> = ({ children, direction }) => {
	const open = useAppSelector((state) => state.drawer[direction])
	const dispatch = useAppDispatch()

	const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event &&
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
		) {
			return
		}
		direction === 'right' ? dispatch(setRightDrawerState(open)) : dispatch(setLeftDrawerState(open))
	}

	return (
		<>
			<IconButton
				color="inherit"
				edge="end"
				onClick={toggleDrawer(true)}
				sx={{
					mx: '1rem',
				}}
			>
				<MenuIcon />
			</IconButton>
			<SwipeableDrawer
				anchor={direction}
				open={open}
				onClose={toggleDrawer(false)}
				onOpen={toggleDrawer(true)}
				sx={{
					'.MuiPaper-root': { width: '300px' },
				}}
			>
				{children}
			</SwipeableDrawer>
		</>
	)
}

export default AppDrawer
