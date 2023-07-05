import { useContext } from 'react'
import { appAxios, axiosPrivate } from '../api/axios'
import AuthContext, { AuthProvider } from '../context/AuthProvider'
import useAxiosPrivate from './useAxiosPrivate'
import { useLocation, useNavigate } from 'react-router-dom'
import { routes } from '../router/Root'

const useRefreshToken = () => {
	const { login, logOut } = useContext(AuthContext)
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

			// login(response.data.accessToken)

			return response.data.accessToken
		} catch (err) {
			// logOut()
			// location.pathname !== routes.login && location.assign(routes.login)
		}
	}
	return refresh
}

export default useRefreshToken
