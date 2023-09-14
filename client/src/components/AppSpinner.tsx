import { Box, CircularProgress, Skeleton, Stack, styled } from '@mui/material'

interface Props {
	amount?: number
	circle?: boolean
	contained?: boolean
	text?: string
}

const AppSpinner: React.FC<Props> = ({ text, contained = false, amount = 4, circle = true }) => {
	if (contained) return <ContainedSpinner text={text} />

	if (circle) return <WholePageSpinner text={text} />

	return <SkeletonSpinner amount={amount} />
}

/**
 * Spinner on the whole page
 **/
const WholePageSpinner: React.FC<{ text: string | undefined }> = ({ text }) => (
	<SpinnerContainer>
		<div>
			<CircularProgress />
		</div>
		<div>{text}</div>
	</SpinnerContainer>
)

/**
 * Show spinner in the middle of a container
 **/
const ContainedSpinner: React.FC<{ text: string | undefined }> = () => (
	<Box
		sx={{
			height: '100%',
			display: 'flex',
		}}
	>
		<CircularProgress
			sx={{
				alignSelf: 'center',
				margin: '0 auto',
			}}
		/>
	</Box>
)

const SkeletonSpinner: React.FC<{ amount: number }> = ({ amount }) => (
	<Stack direction="column">
		{Array(amount)
			.fill(null)
			.map((_, i) => (
				<Stack direction="row" gap={2} key={i} mb="1rem">
					<Skeleton variant="circular" width={40} height={40} />
					<Skeleton variant="rounded" width={210} height={40} />
				</Stack>
			))}
	</Stack>
)

const SpinnerContainer = styled('div')`
	position: fixed;
	z-index: 1;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;

	div {
		margin-top: 0.5rem; /* Adjust this margin as needed */
	}
`

export default AppSpinner
