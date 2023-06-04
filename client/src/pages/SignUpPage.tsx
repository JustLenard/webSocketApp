import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import { CssVarsProvider } from '@mui/joy/styles'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../utils/ApiRequest'
import { useContext } from 'react'
import AuthContext from '../auth/AuthProvider'
import { axiosPrivate } from '../api/axios'
import { routes } from '../router/Root'

interface SignUpForm {
	username: string
	password: string
	repeatPassword: string
}

const SignUpPage: React.FC = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<SignUpForm>()

	const navigate = useNavigate()

	const { accessToken, login } = useContext(AuthContext)

	const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
		const response = await axiosPrivate.post('/auth/signup', {
			username: data.username,
			password: data.password,
		})

		login(response.data.accessToken)
		navigate(routes.chat)
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
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl>
							<FormLabel>Username</FormLabel>
							<Input type="text" placeholder="Connor" {...register('username', { required: true })} />
						</FormControl>
						<FormControl>
							<FormLabel>Password</FormLabel>
							<Input
								type="password"
								placeholder="password"
								{...register('password', { required: true, maxLength: 5 })}
								autoComplete="off"
							/>
							{errors.password && <span>This field is required</span>}
						</FormControl>

						<FormControl>
							<FormLabel>Confirm password</FormLabel>
							<Input
								autoComplete="off"
								type="password"
								placeholder="password"
								{...register('repeatPassword', { required: true })}
							/>
						</FormControl>

						<Button sx={{ mt: 1 /* margin top */ }} type="submit">
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

export default SignUpPage
