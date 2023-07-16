import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserEntity } from 'src/utils/entities/user.entity'
import { JwtPayload } from 'src/utils/types/types'

export const GetCurrentUser = createParamDecorator((_: undefined, context: ExecutionContext): UserEntity => {
	const request = context.switchToHttp().getRequest()
	const user = request.user as UserEntity

	return user
})
