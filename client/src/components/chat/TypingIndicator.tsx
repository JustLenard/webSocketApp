import { Typography } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useSocket } from '../../hooks/contextHooks'
import { socketEvents } from '../../utils/constants'

const TypingIndicator = () => {
	const { appSocket } = useSocket()

	const [userTyping, setUserTyping] = useState<null | string>(null)

	useEffect(() => {
		if (!appSocket) return
		appSocket.on(socketEvents.onTypingStart, (userName: string) => {
			setUserTyping(userName)
		})
		appSocket.on(socketEvents.onTypingStop, () => {
			setUserTyping(null)
		})
		return () => {
			appSocket.off(socketEvents.onTypingStart)
			appSocket.off(socketEvents.onTypingStop)
		}
	}, [appSocket])

	return (
		<Typography level="body-sm" ml={'1rem'} height={'20px'} mt={'5px'}>
			{userTyping ? `${userTyping} is typing...` : ' '}
		</Typography>
	)
}

export default TypingIndicator
