import { ColorPaletteProp } from '@mui/joy'
import { ALPHABET, MUI_COLORS } from './constants'

export const colorMap = new Map<string, ColorPaletteProp>()

const createLetterCollorMap = () => {
	const colors: ColorPaletteProp[] = []
	for (let i = 0; i < 5; i++) {
		colors.push(...MUI_COLORS)
	}
	colors.push('primary')

	ALPHABET.map((letter, i) => colorMap.set(letter, colors[i]))

	console.log('This is colorMap', colorMap)
}
createLetterCollorMap()
