import { Injectable } from '@nestjs/common';
import { CreateChatGptDto } from './dto/create-chat-gpt.dto';
import { UpdateChatGptDto } from './dto/update-chat-gpt.dto';

import { Configuration, OpenAIApi } from 'openai';

console.log('This is process.env.OPENAI_API_KEY', process.env.OPENAI_API_KEY);
console.log('This is process.env.SECRET', process.env.SECRET);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

@Injectable()
export class ChatGptService {
  async create(createChatGptDto: CreateChatGptDto) {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'animal',
      temperature: 0.6,
    });
    console.log('This is completion', completion);
    // return 'This action adds a new chatGpt';
    return completion;
  }
}
