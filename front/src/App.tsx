import { useEffect } from 'react'
import { useAppSelector } from './hooks/reduxHooks'
import { useSocket } from './hooks/useSocket'

interface Props {}

const App: React.FC<Props> = () => {
	const socketReducer = useAppSelector((state) => state.socketReducer)

	const socket = useSocket('ws://localhost:5000', {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	})

	useEffect(() => {
		// Connet to the webSocket
	}, [])
	return (
		<div>
			<div>socket id {socketReducer.uid}</div>
			<div>active users: {socketReducer.users.length}</div>
			<div></div>
		</div>
	)
}

export default App
