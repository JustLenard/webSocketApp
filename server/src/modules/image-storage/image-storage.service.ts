import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Inject, Injectable } from '@nestjs/common'
import { UploadImageParams } from 'src/utils/types/types'
import { IImageStorageService } from './image-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { compressImage } from 'src/utils/helpers'

@Injectable()
export class ImageStorageService implements IImageStorageService {
	constructor(
		@Inject('s3Instance')
		private readonly s3: S3Client,
	) {}

	get(imageKey: string) {
		const command = new GetObjectCommand({
			Bucket: process.env.BUCKET_NAME,
			Key: imageKey,
		})

		return getSignedUrl(this.s3, command, { expiresIn: 3600 })
	}

	async getMultiple(profiles: { avatar: string; id: string }[]) {
		const links = profiles.map(async (item) => {
			const command = new GetObjectCommand({
				Bucket: process.env.BUCKET_NAME,
				Key: item.avatar,
			})
			return {
				id: item.id,
				avatar: await getSignedUrl(this.s3, command, { expiresIn: 3600 }),
			}
		})
		return await Promise.all(links)
	}

	async upload(params: UploadImageParams) {
		const compresedImage = await compressImage(params.file)
		const command = new PutObjectCommand({
			Bucket: process.env.BUCKET_NAME,
			Key: params.key,
			// Body: params.file.buffer,
			Body: compresedImage,

			ContentType: params.file.mimetype,
		})
		return this.s3.send(command)
	}
}
