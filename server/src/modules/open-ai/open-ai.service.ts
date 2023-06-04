import { Injectable } from '@nestjs/common'
import { CreateOpenAiDto } from './dto/create-open-ai.dto'
import { UpdateOpenAiDto } from './dto/update-open-ai.dto'
import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai'
import axios from 'axios'

const DEFAULT_MODEL_ID = 'text-davinci-003'
const DEFAULT_TEMPERATURE = 0.9

@Injectable()
export class OpenAiService {
	private openAiApi: OpenAIApi

	private readonly apiUrl = 'https://api.openai.com/v1/'

	constructor() {
		const configuration = new Configuration({
			organization: process.env.ORGANIAZATION_ID,
			apiKey: process.env.OPENAI_API_KEY,
		})
		this.openAiApi = new OpenAIApi(configuration)
	}

	async getModelAnswer(question: string, temperature?: number) {
		try {
			const params: CreateCompletionRequest = {
				model: DEFAULT_MODEL_ID,
				prompt: question,
				temperature: temperature ? temperature : DEFAULT_TEMPERATURE,
			}

			const response = await this.openAiApi.createCompletion(params)

			const { data } = response

			if (data.choices.length) return data.choices

			return response.data
		} catch (e) {
			console.log('This is e', e)
		}
	}

	async generateText(prompt: string): Promise<string> {
		// console.log(
		//   'This is process.env.OPENAI_API_KEY',
		//   process.env.OPENAI_API_KEY,
		// );
		// const response = await this.openai.createCompletion({
		//   model: 'text-davinci-002',
		//   prompt,
		//   temperature: 0.5,
		//   max_tokens: 60,
		//   n: 1,
		//   stop: '\n',
		// });
		// console.log('This is response', response);
		// console.log(
		//   'This is process.env.OPENAI_API_KEY',
		//   process.env.OPENAI_API_KEY,
		// );

		const response = await axios.post(
			`${this.apiUrl}engines/davinci-codex/completions`,
			{
				prompt,
				max_tokens: 1024,
				temperature: 0.5,
				n: 1,
				stop: '\n',
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
			},
		)

		console.log('This is response', response)

		// return response.choices[0].text.trim();
		return 'hey'
	}
}
