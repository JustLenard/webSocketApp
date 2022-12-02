import { getColorNumber } from '../utils/getColorNumber'

interface Props {
	name?: string
	imageUrl?: string
}

const UserCard: React.FC<Props> = ({ name = 'Connor', imageUrl = 'image' }) => {
	// const i = getColorNumber()
	// console.log('This is i', i)

	return (
		<div className="border-solid border-2 border-black my-2 p-2 flex">
			<div className="bg-slate-950 rounded-full flex justify-center items-center w-10 h-10 ">
				{name[0].toUpperCase()}
			</div>

			<p className="flex items-center ml-3">{name}</p>
		</div>
	)
}

export default UserCard
