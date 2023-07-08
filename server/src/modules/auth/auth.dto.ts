import { IsNotEmpty, IsString, Min, MinLength } from 'class-validator'

export class AuthDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(3, { message: 'Username should have at least 3 characters' })
	// @Min(3, { message: 'Username should have at least 3 characters' })
	username: string

	@IsNotEmpty()
	@IsString()
	@MinLength(6, { message: 'Password should be at least 6 characters long' })
	password: string
}
