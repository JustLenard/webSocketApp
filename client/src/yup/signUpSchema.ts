import { ObjectSchema, object, ref, string } from 'yup'
import { minOneLetterAndNumber } from './customValidations'
import { SignUpForm } from '../types/types'

export const SignUpFormSchema: ObjectSchema<SignUpForm> = object({
	username: string().min(3, 'Username should be at least 3 characters long').defined(),
	password: string()
		.required('Password is required')
		.min(6, 'Password length should be at least 6 characters')
		.max(24, 'Password cannot exceed more than 24 characters')
		.test(
			'customValidation',
			'Password should be at least 6 characters long and have a minimum of one letter and number',
			(value: string) => minOneLetterAndNumber(value),
		),
	//Doesn't allow special characters like ! or & :/
	// .matches(
	// 	/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
	// 	'Password should be at least 6 characters long and have a minimum of one letter and number',
	// ),

	cpassword: string()
		.required('Confirm Password is required')
		.min(6, 'Password length should be at least 6 characters')
		.max(24, 'Password cannot exceed more than 24 characters')
		.oneOf([ref('password')], "Passwords don't match"),
})
