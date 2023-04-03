import { PartialType } from '@nestjs/mapped-types';
import { CreateChatGptDto } from './create-chat-gpt.dto';

export class UpdateChatGptDto extends PartialType(CreateChatGptDto) {}
