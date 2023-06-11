import { useContext } from 'react'
import { appAxios, axiosPrivate } from '../api/axios'
import AuthContext, { AuthProvider } from '../auth/AuthProvider'

const useRefreshToken = () => {
	const { login } = useContext(AuthContext)

	const refresh = async () => {
		try {
			const response = await axiosPrivate.post('/auth/refresh', {
				withCredentials: true,
			})

			// login(response.data.accessToken)

			return response.data.accessToken
		} catch (err) {
			console.log('This is err', err)
		}
	}
	return refresh
}

export default useRefreshToken