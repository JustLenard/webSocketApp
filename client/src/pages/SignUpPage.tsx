import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Sheet from '@mui/joy/Sheet'
import { CssVarsProvider } from '@mui/joy/styles'
import Typography from '@mui/joy/Typography'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

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

	const onSubmit: SubmitHandler<SignUpForm> = (data) => console.log(data)

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
							<Input
								type="text"
								placeholder="Connor"
								{...(register('username'), { required: true })}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Password</FormLabel>
							<Input
								type="password"
								placeholder="password"
								{...(register('password'), { required: true, maxLength: 5 })}
							/>
							{errors.password && <span>This field is required</span>}
						</FormControl>

						<FormControl>
							<FormLabel>Confirm password</FormLabel>
							<Input
								type="password"
								placeholder="password"
								{...(register('repeatPassword'), { required: true })}
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
