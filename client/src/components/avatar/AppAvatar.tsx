import { Avatar } from '@mui/joy'
import { getColorPalletteProp, getSubstring } from '../../utils/helpers'

type Props = {
	username: string
	imageUrl?: string
}

const AppAvatar: React.FC<Props> = ({ imageUrl, username }) => {
	return (
		<Avatar color={getColorPalletteProp(username)} src={imageUrl}>
			{getSubstring(username)}
		</Avatar>
	)
}

export default AppAvatar
