import { createContext } from 'react'
import { Socket } from 'socket.io-client'

export type SocketContextType = {
	appSocket: Socket | null
}

export const SocketContext = createContext<SocketContextType>({} as SocketContextType)
