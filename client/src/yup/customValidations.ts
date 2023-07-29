import { ALPHABET, DIGITS } from '../utils/constants'

export const minOneLetterAndNumber = (pass: string): boolean => {
	let numberCheck = false
	let letterCheck = false

	pass.toLowerCase()
		.split('')
		.forEach((letter) => {
			if (DIGITS.includes(letter)) {
				numberCheck = true
			}

			if (ALPHABET.includes(letter)) {
				letterCheck = true
			}
		})
	return numberCheck && letterCheck
}
