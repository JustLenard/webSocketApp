import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator'

export class RoomDto {
	// @IsNotEmpty()
	// @IsNumber()
	// id: number

	@IsNotEmpty()
	@IsString()
	name: string

	@IsString()
	description: string

	@IsNotEmpty()
	@IsBoolean()
	isGroupChat: boolean
}
