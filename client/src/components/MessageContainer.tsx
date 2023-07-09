import { useContext } from 'react'
import { SocketContext } from '../context/SocketProvider'
import Message from './Message'
import { useSocket } from '../hooks/useSocket'

interface Props {}

const MessageContainer: React.FC<Props> = () => {
	const { appSocket, messages } = useSocket()

	return <div>{messages && messages.map((mesasge) => <Message key={mesasge.id} message={mesasge} />)}</div>
}

export default MessageContainer
