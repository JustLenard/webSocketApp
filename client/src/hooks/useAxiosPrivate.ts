import { useEffect } from 'react'
import { appAxios } from '../api/axios'
import { useAuth } from './contextHooks'
import useRefreshToken from './useRefresh'
import { appRoutes } from '../router/Root'

const useAxiosPrivate = () => {
	const refresh = useRefreshToken()
	const { accessToken } = useAuth()

	useEffect(() => {
		const requestIntercept = appAxios.interceptors.request.use(
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

		const responseIntercept = appAxios.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config

				if (error?.response?.status === 403 && !prevRequest?.sent) {
					// const modifiedRequest = { ...prevRequest } // Create a new object based on prevRequest
					// modifiedRequest.sent = true // Update the sent property
					prevRequest.sent = true
					const newAccessToken = await refresh()
					prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
					return appAxios(prevRequest)
				}
				if (error?.response?.status === 401) {
					return location.assign(appRoutes.login)
				}
				return Promise.reject(error)
			},
		)

		return () => {
			appAxios.interceptors.request.eject(requestIntercept)
			appAxios.interceptors.response.eject(responseIntercept)
		}
	}, [accessToken, refresh])

	return { privateAxios: appAxios }
}

export default useAxiosPrivate
