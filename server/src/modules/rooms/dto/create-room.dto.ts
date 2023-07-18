import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class CreateRoomDto {
	@IsNotEmpty()
	@IsString()
	name: string

	// @IsString()
	description?: string | undefined

	@IsNotEmpty()
	@IsBoolean()
	isGroupChat: boolean

	@IsArray()
	users: string[]
}
