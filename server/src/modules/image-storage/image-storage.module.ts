import { S3Client } from '@aws-sdk/client-s3'
import { Module } from '@nestjs/common'
import { ImageStorageService } from './image-storage.service'

@Module({
	providers: [
		{
			provide: 's3Instance',
			useValue: new S3Client({
				credentials: {
					accessKeyId: process.env.ACCESS_KEY,
					secretAccessKey: process.env.SECRET_ACCESS_KEY,
				},
				region: process.env.BUCKET_REGION,
			}),
		},
		{
			provide: 'uploadImages',
			useClass: ImageStorageService,
		},
	],
	exports: [
		{
			provide: 's3Instance',
			useValue: new S3Client({
				credentials: {
					accessKeyId: process.env.ACCESS_KEY,
					secretAccessKey: process.env.SECRET_ACCESS_KEY,
				},
				region: process.env.BUCKET_REGION,
			}),
		},
		{
			provide: 'uploadImages',
			useClass: ImageStorageService,
		},
	],
})
export class ImageStorageModule {}
