export const ALPHABET = [...Array(26)].map((_, i) => (i + 10).toString(36))
export const NUMBERS = [...Array(10)].map((_, i) => i.toString())

export const GLOBAL_ROOM_NAME = 'Global'
export const REFRESH_TOKEN = 'refreshToken'

export enum Routes {
	rooms = 'rooms',
	messages = 'room/:roomId/messages',
	auth = 'auth',
	user = 'users',
	noitificaitons = 'notifications',
}

export enum socketEvents {
	/**
	 * Emited by Backend
	 **/
	messageAdded = 'messageAdded',
	messagePatched = 'messagePatched',
	messageDeleted = 'messageDeleted',
	messages = 'messages',
	/**
	 * Connection
	 **/
	userConnected = 'userConnected',
	userDisconnected = 'userDisconnected',

	/**
	 * Emited by FrontEnd
	 **/
	onRoomJoin = 'onRoomJoin',
	onRoomLeave = 'onRoomLeave',
	onTypingStart = 'onTypingStart',
	onTypingStop = 'onTypingStop',
	createRoom = 'createRoom',
	checkIfPrivateChatExists = 'checkIfPrivateChatExists',
	addMessage = 'addMessage',
	getMessagesForRoom = 'getMessagesForRoom',
}

export enum appEmitters {
	messageCreate = 'message.create',
	messagePatch = 'message.patch',
	messageDelete = 'message.delete',

	roomCreate = 'room.create',
}
