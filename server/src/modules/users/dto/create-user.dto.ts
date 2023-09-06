import { IsNotEmpty, Length } from 'class-validator'

export class CreateUserDto {
	@IsNotEmpty()
	@Length(3, 20)
	username: string

	@IsNotEmpty()
	@Length(3, 20)
	password: string
}
