import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export type ApiMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH'

interface ErrorResponse {
	message: string
	statusCode: number
}

interface ApiResponse<T> {
	data: T | null
	error: ErrorResponse | null
}

export const apiRequest = async <T>(
	endpoint: string,
	method: ApiMethod = 'GET',
	params: any = null
): Promise<ApiResponse<T>> => {
	const config: AxiosRequestConfig = {
		method: method,
		url: import.meta.env.VITE_APP_API + endpoint,
		headers: {
			'Content-Type': 'application/json',
		},
		withCredentials: true,
		data: ['PATCH', 'POST'].includes(method) ? params : undefined,
	}

	console.log('This is config', config)

	try {
		const response: AxiosResponse<T> = await axios.request(config)

		console.log('This is response', response)

		return { data: response.data, error: null }
	} catch (error) {
		let errorMessage = 'Unknown error'

		if (axios.isAxiosError(error)) {
			console.error(error)
			const response = error.response

			const customError: ErrorResponse = {
				message: error.message,
				statusCode: error.code,
			}

			if (response) {
				errorMessage = response?.data?.message ?? response?.statusText
			}
		}

		return {
			data: null,
			error: {
				message: errorMessage,
				statusCode: 500,
			},
		}
	}
}
