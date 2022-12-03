import { useEffect, useState } from 'react'
import UserCard from './components/UserCard'
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks'
import { useSocket } from './hooks/useSocket'
import { remove_user, update_Socket, update_uid, update_users } from './store/socketSlice'
import { chooseRandomColor, getColorNumber } from './utils/getColorNumber'

interface Props {}

const App: React.FC<Props> = () => {
	const socketReducer = useAppSelector((state) => state.socketReducer)
	const dispatch = useAppDispatch()
	const [messages, setMessages] = useState<string[]>([])
	const [inputValue, setInputValue] = useState('')

	const socket = useSocket('ws://localhost:5000', {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	})

	useEffect(() => {
		// Connet to the webSocket

		console.log('This is socket', socket)
		socket.connect()
		console.log('This is socket connected', socket)

		// Save the socket in redux
		dispatch(update_Socket(socket))
		// dispatch(update_Socket(undefined))

		// Start the event listeners
		startListeners()

		// Send handshake
		sendHandshake()
	}, [dispatch, socket])

	const startListeners = () => {
		// User connected event
		socket.on('user_connected', (users: string[]) => {
			console.info('User connected, new user list received')
			dispatch(update_users(users))
		})

		// User disconnected event
		socket.on('user_disconnetced', (user: string) => {
			console.info(`User disconnected ${user}`)
			dispatch(remove_user(user))
		})

		// Reconnect event
		socket.io.on('reconnect', (attempt) => {
			console.info('Reconnected on attemp' + attempt)
		})

		// Reconnect attempt event
		socket.io.on('reconnect_attempt', (attempt) => {
			console.info('Reconnection  attempt' + attempt)
		})

		// Reconnect error
		socket.io.on('reconnect_error', (error) => {
			console.info('Reconnection error' + error)
		})

		// Reconnect failed
		socket.io.on('reconnect_failed', () => {
			console.info('Reconnection failure')
			alert('We were unable to connect to the webSocket')
		})

		// Message received
		socket.on('receive-message', (message: string) => {
			console.info(`message received ${message}`)
			// dispatch(update_users(users))
			// setMessages((messages) => messages.push(message))

			setMessages((messages) => [...messages, message])
		})
	}

	const sendHandshake = () => {
		console.info('Sending handshake to the server...')

		socket.emit('handshake', (uid: string, users: string[]) => {
			dispatch(update_uid(uid))
			dispatch(update_users(users))
		})
	}

	console.log('This is socketReducer', socketReducer)

	const handleClick = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		socket.emit('message', inputValue)
		setMessages((messages) => [...messages, inputValue])
	}

	// const i = getColorNumber()
	// console.log('This is i', i)
	const f = () => {
		console.log('f')
		const arr: number[] = []
		for (let i = 50; i < 1000; i = i + 50) {
			arr.push(i)
			console.log(i)
		}
		console.log(arr)
		console.log(arr.length)
	}

	return (
		<div className="bg-slate-400 p-5 min-h-screen flex">
			<div className="basis-1/4 bg-slate-200 ">1</div>
			<button onClick={() => chooseRandomColor()}>Click</button>

			<div className="basis-3/4">2</div>

			<div className="basis-1/4 bg-slate-200 p-1">
				<UserCard name="hey" />
				<UserCard />
				<UserCard />
			</div>

			{/* <form onSubmit={(e) => handleClick(e)}>
				<input onChange={(e) => setInputValue(e.target.value)} />

				<button>Click</button>
			</form> */}
		</div>
	)
}

export default App
