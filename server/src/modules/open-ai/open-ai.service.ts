import { Injectable } from '@nestjs/common';
import { CreateOpenAiDto } from './dto/create-open-ai.dto';
import { UpdateOpenAiDto } from './dto/update-open-ai.dto';
import { OpenAIApi } from 'openai';

@Injectable()
export class OpenAiService {
  private openai: OpenAIApi;

  // constructor() {
  //   this.openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });
  // }

  async generateText(prompt: string): Promise<string> {
    console.log(
      'This is process.env.OPENAI_API_KEY',
      process.env.OPENAI_API_KEY,
    );
    // const response = await this.openai.createCompletion({
    //   model: 'text-davinci-002',
    //   prompt,
    //   temperature: 0.5,
    //   max_tokens: 60,
    //   n: 1,
    //   stop: '\n',
    // });

    // return response.choices[0].text.trim();
    return 'hey';
  }
}
