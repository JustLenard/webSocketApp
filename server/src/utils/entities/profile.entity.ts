import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity({ name: 'profiles' })
export class ProfileEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: true })
	avatar?: string

	@OneToOne(() => UserEntity)
	user: UserEntity
}
