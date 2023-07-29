import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import { CssVarsProvider } from '@mui/joy/styles'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { appAxios } from '../api/axios'
import { ErrorText } from '../components/ErrorText'
import { useAuth } from '../hooks/contextHooks'
import { appRoutes } from '../router/Root'
import { SignUpForm } from '../types/types'
import { SignUpFormSchema } from '../yup/signUpSchema'

const SignUpPage: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpForm>({
		mode: 'onTouched',
		resolver: yupResolver(SignUpFormSchema),
	})

	const navigate = useNavigate()
	const { login } = useAuth()
	const [manualErrors, setManualErrors] = useState<string | null | string[]>(null)

	const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
		try {
			const response = await appAxios.post('/auth/signup', {
				username: data.username,
				password: data.password,
			})
			login(response.data.accessToken)
			navigate(appRoutes.chat)
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
