import { useContext } from 'react'
import { appAxios } from '../api/axios'
import AuthContext, { AuthProvider } from '../auth/AuthProvider'

const useRefreshToken = () => {
	const { login } = useContext(AuthContext)

	const refresh = async () => {
		const response = await appAxios.get('/refresh', {
			withCredentials: true,
		})

		login(response.data.accessToken)

		return response.data.accessToken
	}
	return refresh
}

export default useRefreshToken
