import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import { Box } from '@mui/material'
import { TMessage } from '../../types/types'
import TimeDisplay from '../TimeDisplay'
import AppAvatar from '../avatar/AppAvatar'
import SimpleMessage from './SimpleMessage'

interface Props {
	message: TMessage
	prev: TMessage | null
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
						<AppAvatar username={message.user.username} imageUrl={message.user.profile?.avatar} />
					</div>
				)}
				<Stack width={'100%'}>
					{showUserInfo && (
						<Stack direction={'row'} gap={1} alignContent={'center'}>
							<Typography color="primary" noWrap>
								{message.user.username}
							</Typography>
							<Typography level="body-sm" alignItems={'center'} display={'flex'}>
								<TimeDisplay date={message.updated_at} />
							</Typography>
						</Stack>
					)}

					<SimpleMessage message={message} showUserInfo={showUserInfo} />
				</Stack>
			</Stack>
		</Box>
	)
}

export default Message
