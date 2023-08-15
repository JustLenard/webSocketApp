import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import { styled } from '@mui/joy/styles'
import { IconButton, Input, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMessages, useRooms, useUser } from '../../hooks/contextHooks'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { MessageI } from '../../types/types'
import { handleError } from '../../utils/handleAxiosErrors'
import ResponsiveModal from '../modal/ConfirmationModal'
import AppAvatar from '../avatar/AppAvatar'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

console.log(timezone)
console.log(utc)

interface Props {
	message: MessageI
	prev: MessageI | null
}

export const Message: React.FC<Props> = ({ message, prev }) => {
	const showUserInfo = prev ? prev.user.id !== message.user.id : true

	return (
		<Box sx={{ flexGrow: 1, px: 3, mt: '.25rem' }}>
			<Stack spacing={2} direction="row" alignItems="center">
				{showUserInfo && (
					<div style={{ width: '40px' }}>
						<AppAvatar username={message.user.username} />
					</div>
				)}
				<Stack width={'100%'}>
					{showUserInfo && (
						<Stack direction={'row'} gap={1} alignContent={'center'}>
							<Typography color="neutral" noWrap>
								{message.user.username}
							</Typography>
							{/* <Typography>{moment(message.updated_at).format('L')}</Typography> */}
							{/* <Typography>{moment(message.updated_at).startOf('day').fromNow()}</Typography> */}
							// Assuming message.updated_at is in UTC const utcTimestamp = message.updated_at; // Convert
							UTC timestamp to user's local timezone const localTimestamp = ;
							<Typography>{dayjs(message.updated_at).fromNow()}</Typography>
							{/* <Typography>{dayjs.utc(utcTimestamp).tz(dayjs.tz.guess()).fromNow()}</Typography> */}
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

	// const [localMesasge, setLocalMessage] = useState<null | MessageI>(message)

	const marginLeft = showUserInfo ? 0 : '56px'

	const handleKeypress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (!currentRoom) return
		//it triggers by pressing the enter key
		if (e.keyCode === 13 && edit) {
			try {
				const response = await privateAxios.patch(`room/${currentRoom.id}/messages/${message.id}`, {
					text: edit,
				})
				console.log('This is response', response)
				// setLocalMessage(response.data)
			} catch (err) {
				handleError(err)
			}

			setEdit(null)
		}
	}

	const handleDelete = async () => {
		if (!currentRoom) return
		try {
			const response = await privateAxios.delete(`room/${currentRoom.id}/messages/${message.id}`)

			// if (response.data === 'ok') {
			// 	getMessagesForRoom(currentRoom.id)
			// }
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
						onKeyDownCapture={(e) => handleKeypress(e)}
					/>
				) : (
					<>
						<Typography sx={{ marginLeft: marginLeft }}>{message.text}</Typography>

						<Stack direction={'row'} className="buttons-wrapper">
							{/* <Typography>{moment(message.updated_at).startOf('hour').fromNow()}</Typography> */}
							<Typography>{dayjs(message.updated_at).fromNow()}</Typography>

							{/* <Typography>{moment(message.updated_at).format('L')}</Typography> */}
							{isMessageOwner && (
								<>
									{/* <Tooltip title="Edit"> */}
									<IconButton
										size="small"
										onClick={turnEditModeOn}
										sx={{
											height: '1.5rem',
										}}
									>
										<ModeEditIcon fontSize="small" />
									</IconButton>
									{/* </Tooltip> */}
									{/* <Tooltip title="Delete"> */}
									<IconButton
										size="small"
										onClick={() => setModal(true)}
										sx={{
											height: '1.5rem',
										}}
									>
										<DeleteIcon fontSize="small" />
									</IconButton>
									{/* </Tooltip> */}
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
