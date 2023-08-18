import { RoomI, UserI } from '../types/types'
import {
	ALPHABET,
	CURRENT_ROOM_KEY_NAME,
	GLOBAL_ROOM_NAME,
	MESSAGE_ROOM,
	MUI_COLORS,
	NOTIFICATIONS_ROOM,
} from './constants'
import { appRoutes } from '../router/Root'
import { ColorPaletteProp } from '@mui/joy'
import { colorMap } from './letterToColorMap'
import dayjs from 'dayjs'

export const getRandomInt = (max: number, min = 0) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const selectRandomArrayElement = (elements: any[]) => {
	const randomNumber = getRandomInt(elements.length - 1)
	return elements[randomNumber]
}

export const isInsideOfApplication = () => {
	return location.pathname !== appRoutes.login && location.pathname !== appRoutes.signUp
}

// export const showSpinner = (cond1: boolean, cond2?: boolean) => {
// 	const isInside = isInsideOfApplication()
// 	if (cond1 && isInside) return true
// 	if (cond2 === undefined) return false
// 	if (cond2 && isInside) return true
// 	return false
// }

export const showSpinner = (cond1: boolean) => {
	const isInside = isInsideOfApplication()
	if (cond1 && isInside) return true
	return false
}

export const getReceivingUser = (users: UserI[], sendingUserId: string) => {
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

export const getGlobalRoom = (rooms: RoomI[]) => {
	return rooms.find((room) => room.id === 1 && room.name === GLOBAL_ROOM_NAME && room.isGroupChat) ?? null
}

export const getSavedOrGlobalRoom = (rooms: RoomI[]) => {
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
