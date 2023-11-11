import { useEffect } from 'react'
import { appAxios } from '../axios/axios'
import { useAuth } from './contextHooks'
import useRefreshToken from './useRefresh'

const useAxiosPrivate = (multipartFormData = false) => {
	const refresh = useRefreshToken()
	const { accessToken, setAccessToken } = useAuth()

	useEffect(() => {
		if (!accessToken || !setAccessToken) return

		const requestIntercept = appAxios.interceptors.request.use(
			(config) => {
				multipartFormData && (config.headers['Content-Type'] = 'multipart/form-data')

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

				if (error?.response?.status === 401 && !prevRequest?.sent) {
					prevRequest.sent = true

					const newAccessToken = await refresh()
					setAccessToken(newAccessToken)

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
