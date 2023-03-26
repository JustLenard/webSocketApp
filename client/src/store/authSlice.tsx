import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCookie, removeCookie } from 'typescript-cookie'
import { LogInCredentials } from '../types/types'
import { apiRequest } from '../utils/ApiRequest'

export interface Authentificated {
	logedIn: boolean
	errorMessage: null | string
}

const baseApiUrl = import.meta.env.VITE_APP_API
const authTokenName = import.meta.env.VITE_AUTH_TOKEN_NAME

const initialState: Authentificated = {
	logedIn: getCookie(authTokenName) ? true : false,

	errorMessage: null,
}

/**
 * Log In Slice
 */
export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logInUser: (state) => {
			state.logedIn = true
		},
		logOutuser: (state) => {
			/**
			 * Remove auth token
			 */
			removeCookie(authTokenName)

			state.logedIn = false
			state.errorMessage = null
		},
	},
	extraReducers: (builder) => {
		builder.addCase(authenticateUser.fulfilled, (state, action) => {
			state.errorMessage = action.payload.errorMessage
			state.logedIn = action.payload.logedIn
		})
	},
})

/**
 * Asynchronous action creator for loging in the user
 */
export const authenticateUser = createAsyncThunk<Authentificated, LogInCredentials>(
	'/loginUser',
	async (logInCredentials) => {
		const response = await apiRequest('/auth/login', 'POST', {
			username: logInCredentials.username,
			password: logInCredentials.password,
		})

		console.log('This is response', response)

		if (!response.error && getCookie('token')) {
			return { logedIn: true, errorMessage: null } as Authentificated
		}

		return { logedIn: false, errorMessage: 'oops' }
	}
)

// Action creators are generated for each case reducer function
export const { logInUser, logOutuser } = authSlice.actions

export default authSlice.reducer
