import { appRoutes } from '../router/Root'

export const isInsideOfApplication = () => {
	return location.pathname !== appRoutes.login && location.pathname !== appRoutes.signUp
}
