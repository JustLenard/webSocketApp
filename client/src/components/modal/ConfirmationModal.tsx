import * as React from 'react'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import Typography from '@mui/joy/Typography'

export type Props = {
	open: boolean
	handleClose: () => void
	handleConfirm: () => void
}

const ResponsiveModal: React.FC<Props> = ({ open, handleClose, handleConfirm }) => {
	const onConfirm = () => {
		handleConfirm()
		handleClose()
	}

	return (
		<Modal open={open} onClose={handleClose}>
			<ModalDialog
				sx={(theme) => ({
					[theme.breakpoints.only('xs')]: {
						top: 'unset',
						bottom: 0,
						left: 0,
						right: 0,
						borderRadius: 0,
						transform: 'none',
						maxWidth: 'unset',
					},
				})}
			>
				<Typography id="nested-modal-title" component="h2">
					Are you absolutely sure?
				</Typography>
				<Typography id="nested-modal-description" textColor="text.tertiary">
					This action cannot be undone. This will permanently delete your account and remove your data from
					our servers.
				</Typography>
				<Box
					sx={{
						mt: 1,
						display: 'flex',
						gap: 1,
						flexDirection: { xs: 'column', sm: 'row-reverse' },
					}}
				>
					<Button variant="solid" color="neutral" onClick={onConfirm}>
						Confirm
					</Button>
					<Button variant="outlined" color="neutral" onClick={handleClose}>
						Cancel
					</Button>
				</Box>
			</ModalDialog>
		</Modal>
	)
}

export default ResponsiveModal
