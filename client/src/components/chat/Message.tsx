import * as React from 'react'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'
import { styled } from '@mui/joy/styles'
import Typography from '@mui/joy/Typography'
import { MessageI } from '../../types/BE_entities.types'

interface Props {
	message: MessageI
	prev: MessageI | null
}

export const Message: React.FC<Props> = ({ message, prev }) => {
	// console.log('This is prev', prev)
	// console.log('This is message', message)
	if (prev && prev.user.id === message.user.id) {
		return <SImpleMessage message={message} />
	}

	return (
		<Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3, mt: '.75rem' }}>
			<Stack spacing={2} direction="row" alignItems="center">
				<div style={{ width: '40px' }}>
					<Avatar>{message.user.username[0]}</Avatar>
				</div>
				<Stack direction={'column'}>
					<Typography color="info" noWrap>
						{message.user.username}
					</Typography>

					<Typography noWrap>{message.text}</Typography>
				</Stack>
			</Stack>
		</Box>
	)
}

const SImpleMessage: React.FC<{ message: MessageI }> = ({ message }) => {
	return (
		<Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
			<Typography sx={{ marginLeft: '56px' }} noWrap>
				{message.text}
			</Typography>
		</Box>
	)
}

export default Message
