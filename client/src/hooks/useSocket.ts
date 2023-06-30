import { useContext } from 'react'
import { SocketContext } from '../websocket/SocketProvider'

export const useSocket = () => useContext(SocketContext)
