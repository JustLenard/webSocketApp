import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

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

export const socketSlice = createSlice({
	name: 'socket',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState: defaultSocketIoState,
	reducers: {
		update_Socket: (state, acion) => {
			return { ...state, socket: acion.payload as Socket }
		},
		update_uid: (state, acion) => {
			return { ...state, uid: acion.payload as string }
		},
		update_users: (state, acion) => {
			return { ...state, users: acion.payload as string[] }
		},
		remove_users: (state, acion) => {
			return { ...state, users: state.users.filter((user) => user !== acion.payload) }
		},
	},
})

export const { update_Socket, update_uid, update_users, remove_users } = socketSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSocket = (state: RootState) => state.socketReducer

export default socketSlice.reducer
