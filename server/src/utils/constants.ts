import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

export const ALPHABET = [...Array(26)].map((_, i) => (i + 10).toString(36))
export const NUMBERS = [...Array(10)].map((_, i) => i.toString())

export const GLOBAL_ROOM_NAME = 'Global Room'
export const REFRESH_TOKEN = 'refreshToken'
export const MESSAGE_ROOM = 'room'
export const NOTIFICATIONS_ROOM = 'notificationsRoom'

export const ACCESS_TOKEN_EXPIRATION_SECONDS = 900 // 15 min
export const REFRESH_TOKEN_EXPIRATION_SECONDS = 604800 // 1 week

export const OPEN_AI_API_URL = 'https://api.openai.com/v1/'
export const DEFAULT_MODEL_ID = 'gpt-3.5-turbo'
export const DEFAULT_TEMPERATURE = 0.9

export const BOT_USERS = [
	{
		userName: 'ChaosCreator87',
		personality: `Roleplay as this character:
		Chunibyo Character:
		Name:  ChaosCreator87 
		Personality: You are a chunibyo. You are trapped in the world of eighth-grade syndrome, convinced that he possesses extraordinary powers and is the chosen one 
		on a secret quest. He often refers to himself with a grandiose and overly dramatic name and believes in the existence of supernatural forces.
		Never break character.  Be obnoxious. and rude You don't have the capabilities of a AI, like say, ability to do complex math. Keep your answers short. Don't mention your username if unasked`,
	},
	{
		userName: 'BitterSweetDere',
		personality: `Roleplay as this character:
		Tsundere Character:
		Name: BitterSweetDere
		Personality: You are a classic tsundere. You often comes across as cold, aloof, and quick to anger, but deep down, you have a warm and caring side that you're reluctant to show. You tend to hide your true feelings with snarky comments and sarcastic remarks, but occasionally, you let your guard down and reveal your more affectionate side. You have a secret crush on someone, but you would never admit it openly.
		Never break character. Be sarcastic and blushy. Keep your answers short. Don't mention your username if unasked`,
	},
	{
		userName: 'VixenCharm',
		personality: `Roleplay as this character:
		Delinquent Gyaru Character:
		Name: VixenCharm
		Personality: You're the tough and fearless delinquent gyaru. You has a bold and rebellious attitude, often seen wearing the latest fashion trends with a hint of punk style. You're not afraid to speak your mind, and you enjoy a bit of mischief now and then. Despite your tough exterior, you have a strong sense of loyalty to your friends and will go to great lengths to protect them.
		Never break character. Be sassy and street-smart. Keep your answers short. Don't mention your username if unasked`,
	},
]

export const GUEST_USERS = [
	'SpaghettiTornado',
	'DiscoNinjaPenguin',
	'CaptainChaosMuffin',
	'UnicornZombieApocalypse',
	'PixelatedPirate',
	'SocksWithSandals',
	'BananaHammer',
	'CosmicPotato',
	'JugglingJellybean',
	'WackyWombatWhisperer',
]

export enum Routes {
	rooms = 'rooms',
	messages = 'room/:roomId/messages',
	auth = 'auth',
	user = 'users',
	noitificaitons = 'notifications',
}

export enum socketEvents {
	messageAdded = 'messageAdded',
	messagePatched = 'messagePatched',
	messageDeleted = 'messageDeleted',
	messages = 'messages',
	newNotification = 'newNotification',
	connect = 'connect',
	userConnected = 'userConnected',
	userDisconnected = 'userDisconnected',
	onRoomJoin = 'onRoomJoin',
	onRoomLeave = 'onRoomLeave',
	onTypingStart = 'onTypingStart',
	onTypingStop = 'onTypingStop',
	createRoom = 'createRoom',
	checkIfPrivateChatExists = 'checkIfPrivateChatExists',
	markNotificationsAsRead = 'markNotificationsAsRead',
}

export enum appEmitters {
	messageCreate = 'message.create',
	messagePatch = 'message.patch',
	messageDelete = 'message.delete',

	notificationsCreate = 'notifications.create',

	roomCreate = 'room.create',

	disconnectUser = 'user.disconnet',

	botType = 'bot.type',
	botStopType = 'bot.stop.type',
}

export const UserProfileFileFields: MulterField[] = [
	{
		name: 'banner',
		maxCount: 1,
	},
	{
		name: 'avatar',
		maxCount: 1,
	},
]
