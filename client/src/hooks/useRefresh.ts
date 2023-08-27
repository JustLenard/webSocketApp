import { baseAxios } from '../api/axios'
import { appRoutes } from '../router/Root'
import { handleError } from '../utils/handleAxiosErrors'
import { useAuth } from './contextHooks'

const useRefreshToken = () => {
	const { logOutUser } = useAuth()
	const refresh = async () => {
		try {
			const response = await baseAxios.post('/auth/refresh')

			return response.data.accessToken
		} catch (err) {
			handleError(err)
			logOutUser()
			// location.assign(appRoutes.login)
		}
	}
	return refresh
}

export default useRefreshToken
