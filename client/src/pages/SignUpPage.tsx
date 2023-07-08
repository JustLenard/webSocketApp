import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import { CssVarsProvider } from '@mui/joy/styles'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../utils/apiRequest'
import { ReactNode, useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthProvider'
import { axiosPrivate } from '../api/axios'
import { routes } from '../router/Root'
import { isAxiosError } from 'axios'
import { useAuth } from '../hooks/useAuth'
import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema, number, object, ref, string } from 'yup'

interface SignUpForm {
	username: string
	password: string
	cpassword: string
}

const SignUpPage: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpForm>({
		mode: 'onTouched',
		resolver: yupResolver(formSchema),
	})

	const navigate = useNavigate()
	const { login } = useAuth()
	const [manualErrors, setManualErrors] = useState<string | null | string[]>(null)

	const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
		try {
			const response = await axiosPrivate.post('/auth/signup', {
				username: data.username,
				password: data.password,
			})
			login(response.data.accessToken)
			navigate(routes.chat)
		} catch (err) {
			if (isAxiosError(err)) {
				setManualErrors(err.response?.data.message)
			}
		}
	}

	return (
		<CssVarsProvider>
			<main>
				<Sheet
					sx={{
						width: 300,
						mx: 'auto', // margin left & right
						my: 4, // margin top & botom
						py: 3, // padding top & bottom
						px: 2, // padding left & right
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						borderRadius: 'sm',
						boxShadow: 'md',
					}}
					variant="outlined"
				>
					<div>
						<Typography level="h4" component="h1">
							<b>Sign Up!</b>
						</Typography>
					</div>

					{manualErrors && renderErrors(manualErrors)}

					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl>
							<FormLabel>Username</FormLabel>
							<Input type="text" placeholder="Connor" {...register('username')} />
							{errors.username && <ErrorText>{errors.username.message}</ErrorText>}
						</FormControl>
						<FormControl>
							<FormLabel>Password</FormLabel>
							<Input
								type="password"
								placeholder="password"
								{...register('password')}
								autoComplete="off"
							/>
							{errors.password && <ErrorText>{errors.password.message}</ErrorText>}
						</FormControl>

						<FormControl>
							<FormLabel>Confirm password</FormLabel>
							<Input
								autoComplete="off"
								type="password"
								placeholder="password"
								{...register('cpassword')}
							/>

							{errors.cpassword && <ErrorText>{errors.cpassword.message}</ErrorText>}
						</FormControl>

						<Button sx={{ mt: 1 /* margin top */ }} type="submit" fullWidth>
							Sign Up
						</Button>
					</form>
					<Typography
						endDecorator={<Link to={'/login'}>Log in!</Link>}
						fontSize="sm"
						sx={{ alignSelf: 'center' }}
					>
						Already have a account?
					</Typography>
				</Sheet>
			</main>
		</CssVarsProvider>
	)
}

const formSchema: ObjectSchema<SignUpForm> = object({
	username: string().min(3, 'Username should be at least 3 characters long').defined(),
	password: string()
		.required('Password is required')
		.min(6, 'Password length should be at least 6 characters')
		.max(12, 'Password cannot exceed more than 12 characters')
		.matches(
			/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
			'Password should be at least 6 characters long and have a minimum of one letter and number',
		),

	cpassword: string()
		.required('Confirm Password is required')
		.min(6, 'Password length should be at least 6 characters')
		.max(12, 'Password cannot exceed more than 12 characters')
		.oneOf([ref('password')], "Passwords don't match"),
})

const ErrorText: React.FC<{ children: ReactNode }> = ({ children }) => (
	<Typography color="danger" fontSize="sm" my={'.5rem'}>
		{children}
	</Typography>
)

export const renderErrors = (errors: string | string[] | undefined) => {
	if (typeof errors === 'undefined')
		return (
			<Typography color={'danger'} fontSize="sm" variant="soft">
				Something went wrong. Please try again later.
			</Typography>
		)

	if (typeof errors === 'string')
		return (
			<Typography color={'danger'} fontSize="sm" variant="soft">
				{errors}
			</Typography>
		)

	return (
		<div>
			{errors.map((error) => (
				<Typography color={'danger'} fontSize="sm" variant="soft" key={error}>
					{error}
				</Typography>
			))}
		</div>
	)
}

export default SignUpPage
