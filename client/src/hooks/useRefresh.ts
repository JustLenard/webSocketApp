import { appAxios } from '../api/axios'
import { useAuth } from './contextHooks'

const useRefreshToken = () => {
	const { login, logOut } = useAuth()

	const refresh = async () => {
		try {
			console.log('this shit')
			const response = await appAxios.post('/auth/refresh', {
				withCredentials: true,
			})

			console.log('This is response.data', response.data)

			console.log('This is login', login)
			// login(response.data.accessToken)
			console.log('after login')

			return response.data.accessToken
		} catch (err) {
			// logOut()
			// location.pathname !== routes.login && location.assign(routes.login)
		}
	}
	return refresh
}

export default useRefreshToken
