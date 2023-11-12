import { UploadImageParams } from 'src/utils/types/types'

export interface IImageStorageService {
	upload(params: UploadImageParams)
}
