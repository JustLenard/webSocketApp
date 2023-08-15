import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import { CssVarsProvider } from '@mui/joy/styles'
import { Stack } from '@mui/material'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { appAxios } from '../api/axios'
import { ErrorText } from '../components/ErrorText'
import { useAuth } from '../hooks/contextHooks'
import { appRoutes } from '../router/Root'
import { LogInCredentials } from '../types/types'
import { LogInFormSchema } from '../yup/logInSchema'
import { renderErrors } from './SignUpPage'

const publicUsername = import.meta.env.VITE_PUBLIC_USERNAME
const publicPassword = import.meta.env.VITE_PUBLIC_PASSWORD

const LoginPage: React.FC = () => {
	const [manualErrors, setManualErrors] = useState<string | null | string[]>(null)
	const location = useLocation()
	const navigate = useNavigate()
	const { loggedIn, login } = useAuth()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LogInCredentials>({
		resolver: yupResolver(LogInFormSchema),
	})

	// If the user is loged in, send him from the page he was coming from or to Home page
	useEffect(() => {
		if (loggedIn) {
			location.state ? navigate(location.state.path) : navigate(appRoutes.chat)
		}
	}, [navigate, location.state, loggedIn])

	const onSubmit: SubmitHandler<LogInCredentials> = async (credentials) => {
		try {
			const response = await appAxios.post('/auth/signin', credentials)
			login(response.data.accessToken)
		} catch (err) {
			if (isAxiosError(err)) {
				setManualErrors(err.response?.data.message)
			}
		}
	}

	const logInAsGuest = async () => {
		try {
			const response = await appAxios.post('/auth/guest')
			login(response.data.accessToken)
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
						mx: 'auto',
						my: 4,
						py: 3,
						px: 2,
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
							<b>Welcome!</b>
						</Typography>
						<Typography level="body-sm">Sign in to continue.</Typography>
					</div>

					{manualErrors && renderErrors(manualErrors)}

					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl>
							<FormLabel>Username</FormLabel>
							<Input placeholder="ex: Connor" defaultValue={publicUsername} {...register('username')} />
							{errors.username && <ErrorText>{errors.username.message}</ErrorText>}
						</FormControl>

						<FormControl>
							<FormLabel>Password</FormLabel>
							<Input
								type="password"
								placeholder="password"
								defaultValue={publicPassword}
								{...register('password')}
							/>
							{errors.password && <ErrorText>{errors.password.message}</ErrorText>}
						</FormControl>

						<Stack display={'flex'}>
							<Button type="submit" sx={{ mt: 1 }}>
								Log in
							</Button>
						</Stack>
					</form>
					<Button onClick={logInAsGuest}>Log in as guest</Button>
					<Typography
						endDecorator={<Link to={appRoutes.signUp}>Sign up</Link>}
						fontSize="sm"
						sx={{ alignSelf: 'center' }}
					>
						Don't have an account?
					</Typography>
				</Sheet>
			</main>
		</CssVarsProvider>
	)
}

export default LoginPage
