import axios from 'axios'

const apiUrl = import.meta.env.VITE_APP_API

export const baseAxios = axios.create({
	baseURL: apiUrl,
	withCredentials: true,
})

export const appAxios = axios.create({
	baseURL: apiUrl,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
})
