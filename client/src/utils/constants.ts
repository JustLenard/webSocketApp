export const ALPHABET = [...Array(26)].map((_, i) => (i + 10).toString(36))
export const NUMBERS = [...Array(10)].map((_, i) => i.toString())

export const GLOBAL_ROOM_NAME = 'Global'

export enum socketEvents {
	/**
	 * Emited by Backend
	 **/
	messageAdded = 'messageAdded',
	messages = 'messages',

	/**
	 * Emited by FrontEnd
	 **/
	createRoom = 'createRoom',
	checkIfPrivateChatExists = 'checkIfPrivateChatExists',
	addMessage = 'addMessage',
	getMessagesForRoom = 'getMessagesForRoom',
}
