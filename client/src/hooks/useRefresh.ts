import { baseAxios } from '../axios/axios'
import { appRoutes } from '../router/Root'
import { LOGGED_IN_KEY_NAME } from '../utils/constants'
import { handleError } from '../utils/handleAxiosErrors'

const useRefreshToken = () => {
	const refresh = async () => {
		try {
			const response = await baseAxios.post('/auth/refresh')

			return response.data.accessToken
		} catch (err) {
			handleError(err)
			// logOutUser()
			sessionStorage.removeItem(LOGGED_IN_KEY_NAME)
			location.assign(appRoutes.login)
		}
	}
	return refresh
}

export default useRefreshToken
