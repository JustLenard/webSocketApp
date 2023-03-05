import styled from '@emotion/styled'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
	Divider,
	FormControl,
	FormHelperText,
	Input,
	InputLabel,
	List,
	Tab,
	Tabs,
	TextField,
} from '@mui/material'
import { Box, Container } from '@mui/system'
import { useState } from 'react'
import { Form } from 'react-router-dom'
import LoginForm from '../forms/LoginForm'
import SignInForm from '../forms/SignInForm'

const Button = styled.div`
	color: turquoise;
`
type Tabs = 'LogIn' | 'SignIn'

const Login = () => {
	const [value, setValue] = useState<Tabs>('LogIn')

	const handleChange = (event: React.SyntheticEvent, newValue: Tabs) => {
		setValue(newValue)
	}

	return (
		<Box
			sx={{ border: '2px solid red', height: 'calc(100vh - 16px)', backgroundColor: 'black' }}
			display={'flex'}
			justifyContent="center"
			alignItems={'center'}
		>
			<Box border={'2px solid red'} p={'2rem'} borderRadius={5}>
				<h1>Welcome</h1>
				<TabContext value={value}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<TabList onChange={handleChange} aria-label="lab API tabs example">
							<Tab label="Item One" value="LogIn" />
							<Tab label="Item Two" value="SignIn" />
						</TabList>
					</Box>
					<TabPanel value="LogIn">
						<LoginForm />
					</TabPanel>
					<TabPanel value="SignIn">
						<SignInForm />
					</TabPanel>
				</TabContext>
			</Box>
		</Box>
	)
}

export default Login
