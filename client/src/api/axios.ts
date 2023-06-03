import axios from 'axios'

const apiUrl = import.meta.env.VITE_APP_API

export const appAxios = axios.create({
	baseURL: apiUrl,
})

export const axiosPrivate = axios.create({
	baseURL: apiUrl,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
})
