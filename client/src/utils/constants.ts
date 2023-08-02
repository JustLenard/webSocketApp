export const ALPHABET = [...Array(26)].map((_, i) => (i + 10).toString(36))
export const DIGITS = [...Array(10)].map((_, i) => i.toString())

export const GLOBAL_ROOM_NAME = 'Global'
export const LOGGED_IN_KEY_NAME = 'loggedIn'
export const CURRENT_ROOM_KEY_NAME = 'currentRoom'

export enum socketEvents {
	/**
	 * Emited by Backend
	 **/
	messageAdded = 'messageAdded',
	messagePatched = 'messagePatched',
	messageDeleted = 'messageDeleted',
	messages = 'messages',

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

export enum apiEndpoints {
	messages = '/messages',
}
