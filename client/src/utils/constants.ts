import { ColorPaletteProp } from '@mui/joy'

export const ALPHABET = [...Array(26)].map((_, i) => (i + 10).toString(36))
export const DIGITS = [...Array(10)].map((_, i) => i.toString())

export const GLOBAL_ROOM_NAME = 'Global'
export const LOGGED_IN_KEY_NAME = 'loggedIn'
export const CURRENT_ROOM_KEY_NAME = 'currentRoom'
export const MUI_COLORS: ColorPaletteProp[] = ['primary', 'neutral', 'danger', 'success', 'warning']

export const TRUE = 'true'

export const MESSAGE_ROOM = 'room'
export const NOTIFICATIONS_ROOM = 'notificationsRoom'

export enum socketEvents {
	/**
	 * Emited by Backend
	 **/
	messageAdded = 'messageAdded',
	messagePatched = 'messagePatched',
	messageDeleted = 'messageDeleted',
	messages = 'messages',
	newNotification = 'newNotification',

	/**
	 * Socket connetion
	 **/
	connect = 'connect',

	/**
	 * User connection
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
	markNotificationsAsRead = 'markNotificationsAsRead',
}
