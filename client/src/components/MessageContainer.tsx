import { useContext } from 'react'
import { SocketContext } from '../context/SocketProvider'
import Message from './Message'

interface Props {}

const MessageContainer: React.FC<Props> = () => {
	const { appSocket, messages } = useContext(SocketContext)

	return <div>{messages && messages.map((mesasge) => <Message key={mesasge.id} message={mesasge} />)}</div>
}

export default MessageContainer
