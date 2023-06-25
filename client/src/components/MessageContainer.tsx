import { useContext } from 'react'
import { SocketContext } from '../websocket/SocketProvider'
import Message from './Message'

interface Props {}

const MessageContainer: React.FC<Props> = () => {
	const { appSocket, messages } = useContext(SocketContext)

	console.log('This is messages', messages)

	return <div>{messages && messages.map((mesasge) => <Message key={mesasge.id} message={mesasge} />)}</div>
}

export default MessageContainer
