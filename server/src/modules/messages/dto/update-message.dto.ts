import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateMessageDto {
	@IsNotEmpty()
	@IsString()
	text: string
}
