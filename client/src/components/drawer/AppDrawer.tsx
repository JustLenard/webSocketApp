import Button from '@mui/material/Button'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { PropsWithChildren, ReactNode, useState } from 'react'
import RightMenu from '../rightMenu/RightMenu'
import { Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

type Anchor = 'top' | 'left' | 'bottom' | 'right'
type MUI_BreakPoint = 'xs' | 'sm' | 'md' | 'lg'

interface Props {
	children: ReactNode
	direction: Anchor
	showAt: MUI_BreakPoint
}

const AppDrawer: React.FC<Props> = ({ children, direction, showAt }) => {
	const [state, setState] = useState(false)

	const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event &&
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
		) {
			return
		}

		setState(open)
	}

	return (
		<>
			<IconButton
				color="inherit"
				edge="end"
				onClick={toggleDrawer(true)}
				sx={{
					mx: '1rem',
					display: {
						[showAt]: 'none',
					},
				}}
			>
				<MenuIcon />
			</IconButton>
			<SwipeableDrawer
				anchor={direction}
				open={state}
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
