import Modal from '@mui/joy/Modal'
import ModalClose from '@mui/joy/ModalClose'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import { Fragment, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { changeProfileModalState } from '../../redux/slices/modalStates.slice'
import { Avatar, Button } from '@mui/joy'
import axios from 'axios'
import { baseAxios } from '../../axios/axios'

const ProfileModal = () => {
	const { personalProfileModal } = useAppSelector((state) => state.modals)
	const dispatch = useAppDispatch()

	const [selectedFile, setSelectedFile] = useState(null)

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0])
	}

	const handleFormSubmit = async (event) => {
		event.preventDefault()

		// You can perform further actions, such as sending the file to a server, here.
		if (selectedFile) {
			console.log('File selected:', selectedFile)
			// Add your logic to handle the file on the server here.
			const formData = new FormData()
			formData.append('username', 'wassup')
			formData.append('avatar', selectedFile)

			console.log('This is formData', formData)

			const response = await baseAxios.patch('users/user-profile', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			console.log('This is response.data', response.data)
		} else {
			console.log('No file selected.')
		}
	}

	return (
		<Fragment>
			<Modal
				aria-labelledby="modal-title"
				aria-describedby="modal-desc"
				open={personalProfileModal}
				onClose={() => dispatch(changeProfileModalState(false))}
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
			>
				<Sheet
					variant="outlined"
					sx={{
						maxWidth: 500,
						borderRadius: 'md',
						p: 3,
						boxShadow: 'lg',
					}}
				>
					<ModalClose variant="plain" sx={{ m: 1 }} />
					<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" size="lg" />
					<Button> Upload Profile pic</Button>
					<div>
						<h2>React File Upload Form</h2>
						<form onSubmit={handleFormSubmit}>
							<label htmlFor="file">Choose a file:</label>
							<input
								type="file"
								id="file"
								accept=".png, .jpg, .jpeg"
								onChange={handleFileChange}
								multiple={false}
							/>

							<button type="submit">Upload File</button>
						</form>
					</div>
				</Sheet>
			</Modal>
		</Fragment>
	)
}

export default ProfileModal
