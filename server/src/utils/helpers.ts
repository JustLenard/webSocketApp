export const getRandomInt = (max: number, min = 0) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const selectRandomArrayElement = (elements: any[]) => {
	const randomNumber = getRandomInt(elements.length - 1)
	return elements[randomNumber]
}
