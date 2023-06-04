import ReactDOM from 'react-dom/client'
import App from './App'
import './websocket/SocketProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
