import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Sheet from '@mui/joy/Sheet'
import { CssVarsProvider } from '@mui/joy/styles'
import Typography from '@mui/joy/Typography'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { authenticateUser } from '../store/authSlice'
import { AppDispatch } from '../store/store'
import { LogInCredentials } from '../types/types'
import { useEffect } from 'react'

const publicUsername = import.meta.env.VITE_PUBLIC_USERNAME
const publicPassword = import.meta.env.VITE_PUBLIC_PASSWORD

const LoginPage: React.FC = () => {
	const dispatch = useAppDispatch()
	const location = useLocation()
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<LogInCredentials>()

	const { errorMessage, logedIn } = useAppSelector((state) => state.auth)

	// If the user is loged in, send him from the page he was coming from or to Home page
	useEffect(() => {
		if (logedIn) {
			location.state ? navigate(location.state.path) : navigate('/')
		}
	}, [logedIn, navigate, location.state])

	const onSubmit: SubmitHandler<LogInCredentials> = (credentials) =>
		dispatch(authenticateUser(credentials))

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
							<b>Welcome!</b>
						</Typography>
						<Typography level="body2">Sign in to continue.</Typography>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl>
							<FormLabel>Username</FormLabel>
							<Input
								placeholder="ex: Connor"
								defaultValue={publicUsername}
								{...register('username', { required: true })}
							/>
							{errors.username && <span>This field is required</span>}
						</FormControl>
						<FormControl>
							<FormLabel>Password</FormLabel>
							<Input
								type="password"
								placeholder="password"
								defaultValue={publicPassword}
								{...register('password', { required: true })}
							/>
						</FormControl>
						<Button type="submit" sx={{ mt: 1 /* margin top */ }}>
							Log in
						</Button>
					</form>
					<Typography
						endDecorator={<Link to={'/sign-up'}>Sign up</Link>}
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
