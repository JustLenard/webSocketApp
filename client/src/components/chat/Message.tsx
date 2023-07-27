import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import { styled } from '@mui/joy/styles'
import { Input, IconButton, Tooltip } from '@mui/material'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import moment from 'moment'
import { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useSocket } from '../../hooks/useSocket'
import { useUser } from '../../hooks/useUser'
import { MessageI } from '../../types/BE_entities.types'
import { handleError } from '../../utils/handleAxiosErrors'
import ResponsiveModal from '../modal/ConfirmationModal'

dayjs.extend(relativeTime)

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
						<Stack direction={'row'} gap={1} alignContent={'center'}>
							<Typography color="info" noWrap>
								{message.user.username}
							</Typography>
							{/* <Typography>{moment(message.updated_at).format('L')}</Typography> */}
							<Typography>{moment(message.updated_at).startOf('day').fromNow()}</Typography>
						</Stack>
					)}

					<SImpleMessage message={message} cond={getCond} />
				</Stack>
			</Stack>
		</Box>
	)
}

const SImpleMessage: React.FC<{ message: MessageI; cond: boolean }> = ({ message, cond }) => {
	const { getMessagesForRoom, currentRoom } = useSocket()
	const { user } = useUser()
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

			if (response.data === 'ok' && currentRoom) {
				// setLocalMessage(null)
				getMessagesForRoom(currentRoom.id)
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

	const isMessageOwner = user ? user.id === message.user.id : false

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
							// bgcolor: 'sienna',
							// background: 'red',
						}}
						autoFocus
						fullWidth
						// variant="soft"
						// size="sm"
						value={edit}
						onChange={(e) => setEdit(e.target.value)}
						onKeyDownCapture={(e) => handleKeypress(e)}
					/>
				) : (
					<>
						<Typography sx={{ marginLeft: marginLeft }}>{localMesasge.text}</Typography>

						<Stack direction={'row'} className="buttons-wrapper">
							{/* <Typography>{moment(message.updated_at).startOf('hour').fromNow()}</Typography> */}
							<Typography>{dayjs(message.updated_at).fromNow()}</Typography>

							{/* <Typography>{moment(message.updated_at).format('L')}</Typography> */}
							{isMessageOwner && (
								<>
									{' '}
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
								</>
							)}
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

	.buttons-wrapper {
		display: none;
	}

	&:hover {
		background-color: rgba(0, 0, 0, 0.04);

		.buttons-wrapper {
			display: flex;
		}
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
