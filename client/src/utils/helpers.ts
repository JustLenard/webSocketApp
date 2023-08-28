import { ColorPaletteProp } from '@mui/joy'
import dayjs from 'dayjs'
import { appRoutes } from '../router/Root'
import { TRoom, TUser } from '../types/types'
import { ALPHABET, CURRENT_ROOM_KEY_NAME, GLOBAL_ROOM_NAME, MESSAGE_ROOM, NOTIFICATIONS_ROOM } from './constants'
import { colorMap } from './letterToColorMap'

export const getRandomInt = (max: number, min = 0) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const selectRandomArrayElement = <T>(elements: T[]): T => {
	const randomNumber = getRandomInt(elements.length - 1)
	return elements[randomNumber]
}

export const isInsideOfApplication = () => {
	return location.pathname !== appRoutes.login && location.pathname !== appRoutes.signUp
}

export const showSpinner = (cond1: boolean) => {
	const isInside = isInsideOfApplication()
	if (cond1 && isInside) return true
	return false
}

export const getReceivingUser = (users: TUser[], sendingUserId: string) => {
	return users.filter((user) => user.id !== sendingUserId)[0]
}

export const getCurrentRoomFromSessionStorage = () => {
	const res = sessionStorage.getItem(CURRENT_ROOM_KEY_NAME)

	if (typeof res === 'string') {
		const id = Number(res)
		if (!isNaN(id)) return id
	}
	return null
}

export const getGlobalRoom = (rooms: TRoom[]) => {
	return rooms.find((room) => room.name === GLOBAL_ROOM_NAME && room.isGroupChat) ?? null
}

export const getSavedOrGlobalRoom = (rooms: TRoom[]) => {
	const savedCurrentRoomId = getCurrentRoomFromSessionStorage()
	const currentRoom = rooms.find((room) => room.id === savedCurrentRoomId)

	if (currentRoom) return currentRoom
	return getGlobalRoom(rooms)
}

export const saveRoomIdToSessionStorage = (roomId: number) => {
	return sessionStorage.setItem(CURRENT_ROOM_KEY_NAME, roomId.toString())
}

export const createMessageRoomName = (roomId: number) => {
	return `${MESSAGE_ROOM}-${roomId}`
}

export const createNotifRoomName = (roomId: number) => {
	return `${NOTIFICATIONS_ROOM}-${roomId}`
}

export const getSubstring = (initialString: string, end = 2) => {
	return initialString.slice(0, end).toUpperCase()
}

export const getColorPalletteProp = (yourString: string): ColorPaletteProp => {
	if (!ALPHABET.includes(yourString[0])) return 'neutral'

	return colorMap.get(yourString[0]) ?? 'neutral'
}

export const utcTimeToHumanTime = (date: Date) => {
	return dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()
}

export const createFrequencyMap = (str: string) => {
	const frequency: Record<string, number> = {}

	for (const letter of str) {
		frequency[letter] ??= 0
		frequency[letter]++
	}
	return frequency
}

export const arrayToObj = (arr: string[]) => {
	return arr.reduce((acc: Record<string, string>, red: string) => {
		acc[red] = red
		return acc
	}, {})
}

export const createAuthor = (author: TUser, user: TUser) => {
	return author.username === user.username ? 'You: ' : `${author.username}: `
}
