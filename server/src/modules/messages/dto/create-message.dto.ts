import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class MessageDto {
	@IsNotEmpty()
	@IsString()
	text: string

	@IsNumber()
	@IsNotEmpty()
	roomId: number
}
