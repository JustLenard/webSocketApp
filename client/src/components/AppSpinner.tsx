import styled from '@emotion/styled'
import { CircularProgress, Skeleton, Stack } from '@mui/material'

interface Props {
	amount?: number
	circle?: boolean
	contained?: boolean
	text?: string
}

const AppSpinner: React.FC<Props> = ({ text, contained = false, amount = 2, circle = true }) => {
	if (contained) {
		return (
			<>
				{text}
				<CircularProgress
					sx={{
						alignSelf: 'center',
						textAlign: 'center',
						margin: '0 auto',
					}}
				/>
			</>
		)
	}

	const renderSkeleton = (amount: number) => {
		for (let i = 0; i < amount; i++) {
			return <div>laoding</div>
		}
	}

	return (
		<Stack direction={'column'} gap={2}>
			{circle ? (
				<SpinnerContainer>
					{text}
					<CircularProgress />
				</SpinnerContainer>
			) : (
				Array(amount)
					.fill(null)
					.map((f, i) => {
						return (
							<Stack direction={'row'} gap={2} key={i}>
								{text}
								<Skeleton variant="circular" width={40} height={40} />
								<Skeleton variant="rounded" width={210} height={40} />
							</Stack>
						)
					})
			)}
		</Stack>
	)
}

const SpinnerContainer = styled.div`
	/* border: 1px solid;
	position: fixed;
	z-index: 1;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 50 50'%3E%3Cpath d='M28.43 6.378C18.27 4.586 8.58 11.37 6.788 21.533c-1.791 10.161 4.994 19.851 15.155 21.643l.707-4.006C14.7 37.768 9.392 30.189 10.794 22.24c1.401-7.95 8.981-13.258 16.93-11.856l.707-4.006z'%3E%3CanimateTransform attributeType='xml' attributeName='transform' type='rotate' from='0 25 25' to='360 25 25' dur='0.6s' repeatCount='indefinite'/%3E%3C/path%3E%3C/svg%3E")
		center / 50px no-repeat; */
	/* border: 1px solid; */
	position: fixed;
	z-index: 1;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 50px;
	height: 50px;
	margin: auto;
	/* background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 50 50'%3E%3Cpath d='M28.43 6.378C18.27 4.586 8.58 11.37 6.788 21.533c-1.791 10.161 4.994 19.851 15.155 21.643l.707-4.006C14.7 37.768 9.392 30.189 10.794 22.24c1.401-7.95 8.981-13.258 16.93-11.856l.707-4.006z'%3E%3CanimateTransform attributeType='xml' attributeName='transform' type='rotate' from='0 25 25' to='360 25 25' dur='0.6s' repeatCount='indefinite'/%3E%3C/path%3E%3C/svg%3E")
		center / contain no-repeat; */
`

export default AppSpinner
