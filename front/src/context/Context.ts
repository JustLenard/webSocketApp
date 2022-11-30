import { Socket } from 'socket.io-client'

export interface ISocketContextState {
	socket: Socket | undefined
	uid: string
	users: string[]
}

export const defaultSocketIoState: ISocketContextState = {
	socket: undefined,
	uid: '',
	users: [],
}
