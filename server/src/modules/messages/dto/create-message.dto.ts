import { IsNotEmpty, IsNumber, IsString, IsBoolean, isNumber } from 'class-validator'

export class MessageDto {
	@IsNotEmpty()
	@IsString()
	text: string

	@IsNumber()
	@IsNotEmpty()
	roomId: number
}
