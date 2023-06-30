import { axiosPrivate } from '../api/axios'
import { useContext, useEffect } from 'react'
import { useAppDispatch } from './reduxHooks'
import useRefreshToken from './useRefresh'
import AuthContext from '../auth/AuthProvider'
import { useAuth } from './useAuth'

const useAxiosPrivate = () => {
	const refresh = useRefreshToken()
	const { accessToken, logOut } = useAuth()

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers['Authorization'] && accessToken) {
					config.headers['Authorization'] = `Bearer ${accessToken}`
				}
				return config
			},
			(error) => {
				console.log('This is error?.response?', error?.response)
				return Promise.reject(error)
			},
		)

		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config

				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true
					const newAccessToken = await refresh()
					prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
					return axiosPrivate(prevRequest)
				}
				return Promise.reject(error)
			},
		)

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept)
			axiosPrivate.interceptors.response.eject(responseIntercept)
		}
	}, [accessToken, refresh])

	return axiosPrivate
}

export default useAxiosPrivate
