import { SocketContext } from '../providers/context/socket.context'
import { RoomsContext } from '../providers/context/rooms.context'
import { MessagesContext } from '../providers/context/messages.context'
import { useContext } from 'react'
import AuthContext from '../providers/AuthProvider'
import { UserContext } from '../providers/context/user.context'

export const useRooms = () => useContext(RoomsContext)

export const useMessages = () => useContext(MessagesContext)

export const useUser = () => useContext(UserContext)

export const useAuth = () => useContext(AuthContext)

export const useSocket = () => useContext(SocketContext)
