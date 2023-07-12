import { UserEntity } from 'src/modules/users/entities/user.entity'
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { MessageEntity } from './message.entity'

@Entity('Notifications')
export class NotificationsEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	creatorId: string

	@OneToOne(() => MessageEntity)
	@JoinColumn()
	message: MessageEntity

	@OneToMany(() => UserEntity, (user) => user.notifications)
	@JoinColumn()
	createdFor: UserEntity[]

	@Column('simple-array')
	readBy: string[]

	@Column()
	roomId: number

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}
