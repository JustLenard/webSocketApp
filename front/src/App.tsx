import UserCard from './components/UserCard'
import io, { Socket } from 'socket.io-client'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001')

interface Props {}

const App: React.FC<Props> = () => {
	const sendMessage = () => {
		socket.emit(' hey')
	}

	io.on('connection', (socket) => {
		console.log(`user connect with ${socket.id}`)
	})
	return (
		<>
			<input placeholder="Somethings" />
			<button>Click me</button>
			<UserCard />
		</>
	)
}

export default App
