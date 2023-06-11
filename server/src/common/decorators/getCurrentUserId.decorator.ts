import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { JwtPayload } from 'src/types/jwtPayload.types'

export const GetCurrentUserId = createParamDecorator((_: undefined, context: ExecutionContext): number => {
	const request = context.switchToHttp().getRequest()
	const user = request.user as JwtPayload

	console.log('This is user', user)
	return user.sub
})