import { useContext } from 'react'
import { appAxios, axiosPrivate } from '../api/axios'
import AuthContext, { AuthProvider } from '../auth/AuthProvider'
import useAxiosPrivate from './useAxiosPrivate'
import { useLocation, useNavigate } from 'react-router-dom'

const useRefreshToken = () => {
	const { login, logOut } = useContext(AuthContext)
	// const navigate = useNavigate()
	// const locatoin = useLocation()
	// console.log('This is locatoin', locatoin)

	const refresh = async () => {
		try {
			console.log('triggering refresh')

			const response = await axiosPrivate.post('/auth/refresh', {
				withCredentials: true,
			})

			console.log('This is refresh response', response)

			// login(response.data.accessToken)

			return response.data.accessToken
		} catch (err) {
			logOut()
		}
	}
	return refresh
}

export default useRefreshToken
