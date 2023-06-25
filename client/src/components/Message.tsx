import * as React from 'react'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'
import { styled } from '@mui/joy/styles'
import Typography from '@mui/joy/Typography'
import { MessageI } from '../types/BE_entities.types'

interface Props {
	message: MessageI
}

export const Message: React.FC<Props> = ({ message }) => {
	return (
		<Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
			<Stack spacing={2} direction="row" alignItems="center">
				<Avatar>{message.user.username[0]}</Avatar>
				<Stack direction={'column'} spacing={0}>
					<Typography color="info" noWrap>
						{message.user.username}
					</Typography>

					<Typography noWrap>{message.text}</Typography>
				</Stack>
			</Stack>
		</Box>
	)
}

export default Message
