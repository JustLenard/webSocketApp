import { Avatar } from '@mui/joy'
import { getColorPalletteProp, getSubstring } from '../../utils/helpers'

type Props = {
	username: string
	src?: string
}

const AppAvatar: React.FC<Props> = ({ src, username }) => {
	return (
		<Avatar color={getColorPalletteProp(username)} src={src}>
			{getSubstring(username)}
		</Avatar>
	)
}

export default AppAvatar
