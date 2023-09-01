import { useEffect } from 'react'
import { appAxios } from '../api/axios'
import { useAuth } from './contextHooks'
import useRefreshToken from './useRefresh'
import { appRoutes } from '../router/Root'

const useAxiosPrivate = () => {
	const refresh = useRefreshToken()
	const { accessToken, setAccessToken } = useAuth()

	useEffect(() => {
		if (!accessToken || !setAccessToken) return
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
				const prevRequest = { ...error?.config }

				const { sent, method } = prevRequest
				console.log('This is sent', sent)
				console.log('This is method', method)

				console.log('This is prevRequest at start', prevRequest)
				console.log('This is prevRequest?.method', prevRequest?.method)
				console.log('This is prevRequest?.sent', prevRequest?.sent)

				if (error?.response?.status === 401 && !prevRequest?.sent) {
					// const modifiedRequest = { ...prevRequest } // Create a new object based on prevRequest
					// modifiedRequest.sent = true // Update the sent property
					console.log('This is prevRequest.sent', prevRequest._sent)
					prevRequest.sent = true
					console.log('This is prevRequest with sent', prevRequest)

					const newAccessToken = await refresh()
					setAccessToken(newAccessToken)

					console.log('This is newAccessToken', newAccessToken)
					prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
					return appAxios(prevRequest)
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
