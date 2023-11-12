import { Avatar, Button, Typography } from '@mui/joy'
import Modal from '@mui/joy/Modal'
import ModalClose from '@mui/joy/ModalClose'
import Sheet from '@mui/joy/Sheet'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { changeProfileModalState } from '../../redux/slices/modalStates.slice'

const ProfileModal = () => {
	const { personalProfileModal } = useAppSelector((state) => state.modals)
	const dispatch = useAppDispatch()
	const { privateAxios } = useAxiosPrivate(true)

	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<null | string>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return

		const file = e.target.files[0]

		setSelectedFile(file)

		const previewUrl = URL.createObjectURL(file)
		setPreviewUrl(previewUrl)
	}

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!selectedFile) return

		const formData = new FormData()
		formData.append('avatar', selectedFile)

		console.log('This is formData', formData)

		try {
			await privateAxios.patch('users/user-profile', formData)
			dispatch(changeProfileModalState(false))
			toast.success('Success!')
		} catch (e) {
			console.log(e)
			toast.error('Something went wrong. Try again later')
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
						width: '20%',
					}}
				>
					<ModalClose variant="plain" sx={{ m: 1 }} />
					<Typography color="neutral" level="title-lg" variant="plain" textAlign={'center'}>
						Profile
					</Typography>
					<Avatar
						size="lg"
						src={previewUrl ?? undefined}
						sx={{
							height: 150,
							width: 150,
							my: '1rem',
							mx: 'auto',
						}}
					/>

					<form
						onSubmit={handleFormSubmit}
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<Button
							variant="soft"
							component="label"
							sx={{
								mr: '2rem',
							}}
						>
							Upload
							<input
								hidden
								type="file"
								id="file"
								accept=".png, .jpg, .jpeg"
								onChange={handleFileChange}
								multiple={false}
							/>
						</Button>
						{selectedFile && <Button type="submit">Submit</Button>}
					</form>
				</Sheet>
			</Modal>
		</Fragment>
	)
}

export default ProfileModal
