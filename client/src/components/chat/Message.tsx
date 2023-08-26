import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import { styled } from '@mui/joy/styles'
import { Box, IconButton, Input } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMessages, useRooms, useUser } from '../../hooks/contextHooks'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { MessageI } from '../../types/types'
import { handleError } from '../../utils/handleAxiosErrors'
import { utcTimeToHumanTime } from '../../utils/helpers'
import AppAvatar from '../avatar/AppAvatar'
import ResponsiveModal from '../modal/ConfirmationModal'

interface Props {
	message: MessageI
	prev: MessageI | null
}

export const Message: React.FC<Props> = ({ message, prev }) => {
	const showUserInfo = prev ? prev.user.id !== message.user.id : true

	return (
		<Box
			sx={{
				flexGrow: 1,
				px: {
					xs: '.5rem',
					lg: '1.5rem',
				},
				mt: '.25rem',
			}}
		>
			<Stack spacing={2} direction="row" alignItems="center">
				{showUserInfo && (
					<div style={{ width: '40px' }}>
						<AppAvatar username={message.user.username} />
					</div>
				)}
				<Stack width={'100%'}>
					{showUserInfo && (
						<Stack direction={'row'} gap={1} alignContent={'center'}>
							<Typography color="primary" noWrap>
								{message.user.username}
							</Typography>
							<Typography level="body-sm" alignItems={'center'} display={'flex'}>
								{utcTimeToHumanTime(message.updated_at)}
							</Typography>
						</Stack>
					)}

					<SImpleMessage message={message} showUserInfo={showUserInfo} />
				</Stack>
			</Stack>
		</Box>
	)
}

const SImpleMessage: React.FC<{ message: MessageI; showUserInfo: boolean }> = ({ message, showUserInfo }) => {
	const { currentRoom } = useRooms()
	const { editingMessageId, setEditingMessageId, getMessagesForRoom } = useMessages()
	const { user } = useUser()
	const { privateAxios } = useAxiosPrivate()
	const [edit, setEdit] = useState<null | string>(null)
	const [modal, setModal] = useState(false)

	const marginLeft = showUserInfo ? 0 : '56px'

	/**
	 * On 'Enter' press
	 **/
	const handleEnterKeypress = async (e: React.KeyboardEvent) => {
		if (!currentRoom) return

		if (e.key === 'Enter' && edit) {
			try {
				await privateAxios.patch(`room/${currentRoom.id}/messages/${message.id}`, {
					text: edit,
				})
			} catch (err) {
				handleError(err)
			}

			setEdit(null)
		}
	}

	const handleDelete = async () => {
		if (!currentRoom) return
		try {
			await privateAxios.delete(`room/${currentRoom.id}/messages/${message.id}`)
		} catch (err) {
			handleError(err)
		}
	}

	useEffect(() => {
		if (editingMessageId !== null && editingMessageId !== message?.id) {
			setEdit(null)
		}
	}, [editingMessageId])

	if (!message) return null

	const turnEditModeOn = () => {
		setEdit(message.text)
		setEditingMessageId(message.id)
	}

	const isMessageOwner = user ? user.id === message.user.id : false

	return (
		<>
			<ResponsiveModal handleClose={() => setModal(false)} open={modal} handleConfirm={handleDelete} />
			<StyledStack>
				{edit !== null ? (
					<Input
						sx={{
							marginLeft: marginLeft,
						}}
						autoFocus
						fullWidth
						value={edit}
						onChange={(e) => setEdit(e.target.value)}
						onKeyDownCapture={(e) => handleEnterKeypress(e)}
					/>
				) : (
					<>
						<Typography sx={{ marginLeft: marginLeft }}>{message.text}</Typography>
						<Stack direction={'row'} className="buttons-wrapper">
							<Typography level="body-sm" mr={'.5rem'} alignItems={'center'}>
								{utcTimeToHumanTime(message.updated_at)}
							</Typography>

							{isMessageOwner && (
								<>
									<IconButton
										size="small"
										onClick={turnEditModeOn}
										sx={{
											height: '1.5rem',
											width: '1.5rem',
										}}
									>
										<ModeEditIcon fontSize="small" />
									</IconButton>
									<IconButton
										size="small"
										onClick={() => setModal(true)}
										sx={{
											height: '1.5rem',
											width: '1.5rem',
										}}
									>
										<DeleteIcon fontSize="small" />
									</IconButton>
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

export default Message
