import { Card, Grid } from '@mui/material'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { axiosPrivate } from '../api/axios'
import { useEffect } from 'react'

const RightMenu = () => {
	const privateAxios = useAxiosPrivate()

	useEffect(() => {
		const getUsers = async () => {
			const response = await privateAxios.get('/users')
			console.log('This is response', response)
		}
		// getUsers()
	}, [])

	return (
		<Grid border={'2px solid blue'}>
			<Card>Right Menu</Card>
		</Grid>
	)
}

export default RightMenu
