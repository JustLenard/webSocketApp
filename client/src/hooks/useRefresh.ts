import { useContext } from 'react'
import { appAxios, axiosPrivate } from '../api/axios'
import AuthContext, { AuthProvider } from '../context/AuthProvider'
import useAxiosPrivate from './useAxiosPrivate'
import { useLocation, useNavigate } from 'react-router-dom'
import { appRoutes } from '../router/Root'
import { useAuth } from './useAuth'

const useRefreshToken = () => {
	const { login, logOut } = useAuth()
	// const navigate = useNavigate()
	// const locatoin = useLocation()
	// console.log('This is locatoin', locatoin)

	const refresh = async () => {
		// if (allowd)
		try {
			console.log('this shit')
			const response = await axiosPrivate.post('/auth/refresh', {
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
