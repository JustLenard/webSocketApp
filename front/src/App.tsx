import UserCard from './components/UserCard'

interface Props {}

const App: React.FC<Props> = () => {
	return (
		<>
			<input placeholder="Somethings" />
			<button>Click me</button>
			<UserCard />
		</>
	)
}

export default App
