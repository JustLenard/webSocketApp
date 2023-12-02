import { useEffect } from 'react'
import { formDataAxios } from '../axios/axios'
import { useAuth } from './contextHooks'
import useRefreshToken from './useRefresh'

const useFormDataAxios = () => {
	const refresh = useRefreshToken()
	const { accessToken, setAccessToken } = useAuth()

	useEffect(() => {
		if (!accessToken || !setAccessToken) return

		const requestIntercept = formDataAxios.interceptors.request.use(
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

		const responseIntercept = formDataAxios.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = { ...error?.config }

				if (error?.response?.status === 401 && !prevRequest?.sent) {
					prevRequest.sent = true

					const newAccessToken = await refresh()
					setAccessToken(newAccessToken)

					prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
					return formDataAxios(prevRequest)
				}
				return Promise.reject(error)
			},
		)

		return () => {
			formDataAxios.interceptors.request.eject(requestIntercept)
			formDataAxios.interceptors.response.eject(responseIntercept)
		}
	}, [accessToken, refresh])

	return { formDataAxios: formDataAxios }
}

export default useFormDataAxios
