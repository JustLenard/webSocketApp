export const ALPHABET = [...Array(26)].map((_, i) => (i + 10).toString(36))
export const NUMBERS = [...Array(10)].map((_, i) => i.toString())

export const GLOBAL_ROOM_NAME = 'Global Room'
export const REFRESH_TOKEN = 'refreshToken'
export const MESSAGE_ROOM = 'room'
export const NOTIFICATIONS_ROOM = 'notificationsRoom'

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
}
