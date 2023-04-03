import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { CreateChatGptDto } from './dto/create-chat-gpt.dto';
import { UpdateChatGptDto } from './dto/update-chat-gpt.dto';

@Controller('chat-gpt')
export class ChatGptController {
  constructor(private readonly chatGptService: ChatGptService) {}

  @Post()
  create(@Body() createChatGptDto: CreateChatGptDto) {
    return this.chatGptService.create(createChatGptDto);
  }

  @Get()
  findAll() {
    return this.chatGptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatGptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatGptDto: UpdateChatGptDto) {
    return this.chatGptService.update(+id, updateChatGptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatGptService.remove(+id);
  }
}
