import { Avatar } from '@mui/joy'
import { getRandomColorPalletteProp, getSubstring } from '../../utils/helpers'

type Props = {
	username: string
	src?: string
}

const AppAvatar: React.FC<Props> = ({ src, username }) => {
	return (
		<Avatar color={getRandomColorPalletteProp()} src={src}>
			{getSubstring(username)}
		</Avatar>
	)
}

export default AppAvatar
