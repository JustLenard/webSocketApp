import { Skeleton, Stack } from '@mui/material'

interface Props {
	amount?: number
}

const AppLoading: React.FC<Props> = ({ amount = 2 }) => {
	const renderSkeletonr = (amount: number) => {
		for (let i = 0; i < amount; i++) {
			return <div>laoding</div>
		}
	}

	return (
		<Stack direction={'column'} gap={2}>
			{Array(amount)
				.fill(null)
				.map((f, i) => {
					return (
						<Stack direction={'row'} gap={2} key={i}>
							<Skeleton variant="circular" width={40} height={40} />
							<Skeleton variant="rounded" width={210} height={40} />
						</Stack>
					)
				})}
		</Stack>
	)
}

export default AppLoading
