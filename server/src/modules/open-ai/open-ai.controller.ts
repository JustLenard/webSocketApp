import { Body, Controller, Post } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';

@Controller('open-ai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post()
  async getResponse(@Body('message') message: string): Promise<any> {
    return await this.openAiService.getModelAnswer(message);
  }
}
