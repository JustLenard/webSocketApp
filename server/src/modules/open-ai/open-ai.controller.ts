import { Body, Controller, Post } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';

@Controller('open-ai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post()
  async getResponse(@Body('message') message: string): Promise<any> {
    console.log(message);
    const response = await this.openAiService.getModelAnswer(message);
    // const response = 'f';

    console.log('This is response', response);
    return response;
  }
}
