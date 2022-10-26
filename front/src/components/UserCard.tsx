import * as S from './styles/UserCard.styles'

interface Props {
	name?: string
	imageUrl?: string
}

const UserCard: React.FC<Props> = ({ name = 'Connor', imageUrl = 'image' }) => {
	return (
		<S.Wrapper>
			<S.ImageWrapper>
				<img src="#" />
			</S.ImageWrapper>
			<S.UserName>{name}</S.UserName>
		</S.Wrapper>
	)
}

export default UserCard
