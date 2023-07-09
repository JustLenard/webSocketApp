import { alphabet, numbers } from '../utils/constants'

export const minOneLetterAndNumber = (pass: string): boolean => {
	let numberCheck = false
	let letterCheck = false

	pass.toLowerCase()
		.split('')
		.forEach((letter) => {
			if (numbers.includes(letter)) {
				numberCheck = true
			}

			if (alphabet.includes(letter)) {
				letterCheck = true
			}
		})
	return numberCheck && letterCheck
}
