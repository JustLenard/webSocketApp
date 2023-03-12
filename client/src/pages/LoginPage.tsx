import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Sheet from '@mui/joy/Sheet'
import { CssVarsProvider } from '@mui/joy/styles'
import Typography from '@mui/joy/Typography'
import { Link } from 'react-router-dom'

const LoginPage: React.FC = () => {
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
					<FormControl>
						<FormLabel>Email</FormLabel>
						<Input
							// html input attribute
							name="email"
							type="email"
							placeholder="johndoe@email.com"
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

					<Button sx={{ mt: 1 /* margin top */ }}>Log in</Button>
					<Typography
						endDecorator={<Link to={'/sign-up'}>Sign up</Link>}
						fontSize="sm"
						sx={{ alignSelf: 'center' }}
					>
						Don&apos;t have an account?
					</Typography>
				</Sheet>
			</main>
		</CssVarsProvider>
	)
}

export default LoginPage