import { chooseRandomColor, getColorNumber } from '../utils/getColorNumber'

interface Props {
	name?: string
	imageUrl?: string
	colorP?: string
}

const UserCard: React.FC<Props> = ({ colorP: colorProp, name = 'Connor', imageUrl = 'image' }) => {
	return (
		<div className="border-solid border-2 border-black my-2 p-2 flex">
			<div
				// className={`${chooseRandomColor()} rounded-full flex justify-center items-center w-10 h-10`}
				className={`${colorProp} rounded-full flex justify-center items-center w-10 h-10 ${name}`}

				//
			>
				{name.slice(0, 2).toUpperCase()}
			</div>

			<p className="flex items-center ml-3">{name}</p>
		</div>
	)
}

export default UserCard
