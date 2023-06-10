import { Avatar, Card } from '@mui/material'
import { Stack } from '@mui/system'

interface Props {
	name: string
}

const RoomName: React.FC<Props> = ({ name }) => {
	return (
		<Stack display={'flex'} direction={'row'} border={'1px solid red'} padding={0.5} borderRadius={2}>
			<Avatar>H</Avatar>
			<Stack display={'flex'} justifyContent={'center'} flexGrow={1} marginLeft={3}>
				{name}
			</Stack>
		</Stack>
	)
}

export default RoomName
