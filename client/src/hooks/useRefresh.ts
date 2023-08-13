import { baseAxios } from '../api/axios'
import { appRoutes } from '../router/Root'
import { handleError } from '../utils/handleAxiosErrors'

const useRefreshToken = () => {
	const refresh = async () => {
		try {
			const response = await baseAxios.post('/auth/refresh')

			return response.data.accessToken
		} catch (err) {
			handleError(err)
			location.assign(appRoutes.login)
		}
	}
	return refresh
}

export default useRefreshToken
