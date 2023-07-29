import { useContext } from 'react'
import { SocketContext } from '../providers/context/socket.contetx'

export const useSocket = () => useContext(SocketContext)
