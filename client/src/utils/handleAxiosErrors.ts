import { isAxiosError } from 'axios'

export const handleError = (error: unknown) => {
	if (isAxiosError(error)) {
		console.log(error.response?.data)
	}

	return error
}
