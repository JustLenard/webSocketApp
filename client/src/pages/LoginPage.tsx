import styled from '@emotion/styled'
import {
	Divider,
	FormControl,
	FormHelperText,
	Input,
	InputLabel,
	List,
	TextField,
} from '@mui/material'
import { Box, Container } from '@mui/system'
import { Form } from 'react-router-dom'

const Button = styled.div`
	color: turquoise;
`
const Login = () => {
	return (
		<Box
			sx={{ border: '2px solid red', height: 'calc(100vh - 16px)', backgroundColor: 'black' }}
			display={'flex'}
			justifyContent="center"
			alignItems={'center'}
		>
			<Box border={'2px solid red'} p={'2rem'} borderRadius={5}>
				<h1>Log in</h1>
				<Button>Click</Button>
				<FormControl>
					<TextField label="Email" variant="outlined" size="small" />
					<TextField label="Password" variant="outlined" size="small" />
				</FormControl>
			</Box>
		</Box>
	)
}

export default Login
