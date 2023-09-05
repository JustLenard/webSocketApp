import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'
import { BOT_USERS, DEFAULT_MODEL_ID, DEFAULT_TEMPERATURE, appEmitters } from 'src/utils/constants'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { MessageService } from '../messages/messages.service'
import { NotificationsService } from '../notifications/notifications.service'
import { RoomsService } from '../rooms/rooms.service'

@Injectable()
export class OpenAiService {
	private openAiApi: OpenAIApi
	private logger = new Logger('Open AI service')

	constructor(
		private messageService: MessageService,
		private notifService: NotificationsService,
		private roomService: RoomsService,
		private readonly eventEmitter: EventEmitter2,
	) {
		const configuration = new Configuration({
			organization: process.env.ORGANIAZATION_ID,
			apiKey: process.env.OPENAI_API_KEY,
		})
		this.openAiApi = new OpenAIApi(configuration)
	}

	/**
	 * Create a response from the model
	 **/
	async respondToMessage(room: RoomEntity, botAccount: UserEntity) {
		this.logger.log(`Triggerring model response`)
		const messages = await this.messageService.findMessagesForRoom(room.id)
		const receivingUserId = room.users.filter((user) => user.id !== botAccount.id)[0].id

		/**
		 * Get response from the model
		 **/
		const response = await this.openAiApi.createChatCompletion({
			model: DEFAULT_MODEL_ID,
			temperature: DEFAULT_TEMPERATURE,
			messages: this.formatMessages(messages, botAccount),
		})

		const modelReponse = response.data.choices[0].message.content

		this.eventEmitter.emit(appEmitters.botType, { botUsername: botAccount.username, userId: receivingUserId })

		/**
		 * Timeout is needed to imitate the 'person' typing
		 **/
		const timeOutTime = (modelReponse.length / 6) * 100
		setTimeout(async () => {
			const message = await this.messageService.createMessage(
				{
					roomId: room.id,
					text: modelReponse,
				},
				botAccount,
				room,
			)
			this.logger.log(`Created message: ${message.text}`)

			await this.roomService.addLastMessageToRoom(room, message)

			const notif = await this.notifService.createNotification(message, room)

			this.eventEmitter.emit(appEmitters.botStopType, {
				botUsername: botAccount.username,
				userId: receivingUserId,
			})

			this.eventEmitter.emit(appEmitters.messageCreate, { message, roomId: room.id })
			this.eventEmitter.emit(appEmitters.notificationsCreate, { notif, roomId: room.id, userId: botAccount.id })
		}, timeOutTime)
	}

	/**
	 * Format messages in for model consumption
	 **/
	formatMessages(messages: MessageEntity[], botAccount: UserEntity): ChatCompletionRequestMessage[] {
		const chatHistory: ChatCompletionRequestMessage[] = []
		const modelPersonality = BOT_USERS.find((bot) => bot.userName === botAccount.username).personality
		chatHistory.push({
			role: 'system',
			content: modelPersonality,
		})

		const now = new Date()
		const fiveHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000) // 5 hours ago

		// Filter and limit messages
		const filteredMessages = messages
			.filter((message) => {
				const messageDate = new Date(message.created_at)
				return messageDate >= fiveHoursAgo
			})
			.slice(-10)

		filteredMessages.forEach((message) =>
			chatHistory.push({
				role: message.user.id === botAccount.id ? 'assistant' : 'user',
				content: message.text,
			}),
		)
		return chatHistory
	}
}
