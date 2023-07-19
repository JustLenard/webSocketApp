import ModeEditIcon from '@mui/icons-material/ModeEdit'
import Avatar from '@mui/joy/Avatar'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/joy/Box'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'
import { styled } from '@mui/joy/styles'
import Typography from '@mui/joy/Typography'
import { MessageI } from '../../types/BE_entities.types'
import { Button, IconButton, Input, Tooltip } from '@mui/material'
import { KeyboardEventHandler, useEffect, useState } from 'react'
import { handleError } from '../../utils/handleAxiosErrors'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { apiEndpoints } from '../../utils/constants'
import { ModalDialog } from '@mui/joy'
import ResponsiveModal from '../modal/ConfirmationModal'
import { useSocket } from '../../hooks/useSocket'

interface Props {
	message: MessageI
	prev: MessageI | null
}

export const Message: React.FC<Props> = ({ message, prev }) => {
	const getCond = prev ? prev.user.id === message.user.id : false

	return (
		<Box sx={{ flexGrow: 1, px: 3, mt: '.25rem' }}>
			<Stack spacing={2} direction="row" alignItems="center">
				{!getCond && (
					<div style={{ width: '40px' }}>
						<Avatar>{message.user.username[0]}</Avatar>
					</div>
				)}
				<Stack width={'100%'}>
					{!getCond && (
						<Typography color="info" noWrap>
							{message.user.username}
						</Typography>
					)}

					<SImpleMessage message={message} cond={getCond} />
				</Stack>
			</Stack>
		</Box>
	)
}

const SImpleMessage: React.FC<{ message: MessageI; cond: boolean }> = ({ message, cond }) => {
	const { privateAxios } = useAxiosPrivate()
	const [edit, setEdit] = useState<null | string>(null)
	const { editingMessageId, setEditingMessageId } = useSocket()
	const [modal, setModal] = useState(false)

	const [localMesasge, setLocalMessage] = useState<null | MessageI>(message)

	const [actionsVisible, setActionsVisible] = useState(true)

	const marginLeft = cond ? '56px' : 0

	const handleKeypress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		//it triggers by pressing the enter key
		if (e.keyCode === 13 && edit) {
			try {
				const response = await privateAxios.patch(`/messages/${message.id}`, {
					text: edit,
				})
				console.log('This is response', response)
				setLocalMessage(response.data)
			} catch (err) {
				handleError(err)
			}

			setEdit(null)
		}
	}

	const handleDelete = async () => {
		try {
			const response = await privateAxios.delete(`/messages/${message.id}`)
			console.log('This is response', response)

			if (response.data === 'ok') {
				setLocalMessage(null)
			}
		} catch (err) {
			handleError(err)
		}
	}

	useEffect(() => {
		if (editingMessageId !== null && editingMessageId !== localMesasge?.id) {
			setEdit(null)
		}
	}, [editingMessageId])

	if (!localMesasge) return null

	const turnEditModeOn = () => {
		setEdit(localMesasge.text)
		setEditingMessageId(localMesasge.id)
	}

	return (
		<>
			<ResponsiveModal handleClose={() => setModal(false)} open={modal} handleConfirm={handleDelete} />
			<StyledStack
			// onMouseOver={() => setActionsVisible(true)}
			// onMouseLeave={() => setActionsVisible(false)}
			>
				{edit !== null ? (
					<Input
						sx={{
							marginLeft: marginLeft,
						}}
						value={edit}
						onChange={(e) => setEdit(e.target.value)}
						onKeyDownCapture={(e) => handleKeypress(e)}
					/>
				) : (
					<>
						<Typography sx={{ marginLeft: marginLeft }}>{localMesasge.text}</Typography>
						<Stack direction={'row'}>
							<Tooltip title="Edit">
								<IconButton
									size="small"
									onClick={turnEditModeOn}
									sx={{
										height: '1.5rem',
									}}
								>
									<ModeEditIcon fontSize="small" />
								</IconButton>
							</Tooltip>
							<Tooltip title="Delete">
								<IconButton
									size="small"
									onClick={() => setModal(true)}
									sx={{
										height: '1.5rem',
									}}
								>
									<DeleteIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</Stack>
					</>
				)}
			</StyledStack>
		</>
	)
}

const StyledStack = styled(Stack)`
	display: flex;
	flex-direction: row;
	flex-grow: 1;
	align-items: center;
	justify-content: space-between;

	border-radius: 0.25rem;

	/* div {
		display: none;
	} */

	&:hover {
		background-color: rgba(0, 0, 0, 0.04);

		/* div {
			display: initial;
		} */
	}
`

const Fancy: React.FC<{ message: MessageI }> = ({ message }) => {
	return (
		<Box sx={{ flexGrow: 1, px: 3 }}>
			<Typography sx={{ marginLeft: '56px' }}>{message.text}</Typography>
		</Box>
	)
}

export default Message
