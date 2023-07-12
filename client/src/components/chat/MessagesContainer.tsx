import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../context/SocketProvider'
import Message from './Message'
import { useSocket } from '../../hooks/useSocket'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { MessageI } from '../../types/BE_entities.types'

interface Props {}

const MessagesContainer: React.FC<Props> = () => {
	const privateAxios = useAxiosPrivate()
	const { messages, appSocket, currentRoom } = useSocket()
	// const [messages, setMessages] = useState<null | MessageI[]>(null)

	// const getMessagesForRoom = async (roomId: number) => {
	// 	// appSocket?.emit(socketEvents.getMessagesForRoom, roomId, (callback: MessageI[]) => {
	// 	// 	setMessages(callback)
	// 	// 	console.log('This is callback', callback)
	// 	// })

	// 	try {
	// 		const response = await privateAxios.get(`/messages/${roomId}`)

	// 		setMessages(response.data)
	// 	} catch (err) {
	// 		console.log('This is err', err.response)
	// 	}
	// }

	// useEffect(() => {
	// 	if (currentRoom) {
	// 		getMessagesForRoom(currentRoom.id)
	// 	}
	// }, [currentRoom])

	return <div>{messages && messages.map((mesasge) => <Message key={mesasge.id} message={mesasge} />)}</div>
}

export default MessagesContainer
