import { appAxios } from '../api/axios'
import { handleError } from '../utils/handleAxiosErrors'
import { useAuth } from './contextHooks'

const useRefreshToken = () => {
	const { login, logOut } = useAuth()

	const refresh = async () => {
		try {
			const response = await appAxios.post('/auth/refresh', {
				withCredentials: true,
			})

			return response.data.accessToken
		} catch (err) {
			handleError(err)
		}
	}
	return refresh
}

export default useRefreshToken
