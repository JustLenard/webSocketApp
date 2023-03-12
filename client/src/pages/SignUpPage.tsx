import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Sheet from '@mui/joy/Sheet'
import { CssVarsProvider } from '@mui/joy/styles'
import Typography from '@mui/joy/Typography'
import { Link } from 'react-router-dom'

const SignUpPage: React.FC = () => {
	const handleSubmit = (e) => {
		console.log('submiting')
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
					<FormControl>
						<FormLabel>Username</FormLabel>
						<Input
							// html input attribute
							name="username"
							type="text"
							placeholder="Connor"
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							// html input attribute
							name="password"
							type="password"
							placeholder="password"
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Confirm password</FormLabel>
						<Input
							// html input attribute
							name="password"
							type="password"
							placeholder="password"
						/>
					</FormControl>

					<Button sx={{ mt: 1 /* margin top */ }} onSubmit={handleSubmit}>
						Sign Up
					</Button>
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
