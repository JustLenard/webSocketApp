import { ObjectSchema, object, string } from 'yup'
import { LogInCredentials } from '../types/types'

export const LogInFormSchema: ObjectSchema<LogInCredentials> = object({
	username: string().required().min(3, 'Username should be at least 3 characters long').defined(),
	password: string().required('Password is required'),
})
