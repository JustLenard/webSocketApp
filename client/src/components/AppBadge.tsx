import styled from '@emotion/styled'

type Props = { badgeContent?: number | string }

const AppBadge: React.FC<Props> = ({ badgeContent }) => {
	if (!badgeContent) return
	return <CustomSpan>{parseContent(badgeContent)}</CustomSpan>
}

const parseContent = (badgeContent: number | string) => {
	if (!badgeContent) return null
	if (String(badgeContent).length > 2) return '99+'
	return badgeContent
}

const CustomSpan = styled.span`
	border-radius: 25%;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	background-color: #bd1e1e;
	padding: 0 5px;
	margin-left: 5px;
	font-weight: bold;
	color: white;
`

export default AppBadge
