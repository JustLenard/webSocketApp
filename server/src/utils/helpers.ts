import { MESSAGE_ROOM, NOTIFICATIONS_ROOM } from './constants'

export const getRandomInt = (max: number, min = 0) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const selectRandomArrayElement = <T>(elements: T[]): T => {
	const randomNumber = getRandomInt(elements.length - 1)
	return elements[randomNumber]
}

export const generatePassword = (length: number) => {
	const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
	let password = ''
	for (let i = 0; i < length; i++) {
		const randomIndex = getRandomInt(charset.length - 1)
		password += charset.charAt(randomIndex)
	}
	return password
}

export const createMessageRoomName = (roomId: number) => {
	return `${MESSAGE_ROOM}-${roomId}`
}

export const createNotifRoomName = (roomId: number) => {
	return `${NOTIFICATIONS_ROOM}-${roomId}`
}
