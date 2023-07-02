import { routes } from '../router/Root'

export const isInsideOfApplication = () => {
	return location.pathname !== routes.login && location.pathname !== routes.signUp
}
