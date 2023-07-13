export const socketEvents = {
	/**
	 * Emited by Backend
	 **/
	messageAdded: 'messageAdded',
	messages: 'messages',

	/**
	 * Emited by FrontEnd
	 **/
	createRoom: 'createRoom',
	checkIfPrivateChatExists: 'checkIfPrivateChatExists',
	addMessage: 'addMessage',
	getMessagesForRoom: 'getMessagesForRoom',
}
