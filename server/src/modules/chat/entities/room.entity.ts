import { User } from 'src/modules/users/entities/user.entity'
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Rooms')
export class RoomEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column({ nullable: true })
	description: string

	@ManyToMany(() => User)
	@JoinTable()
	users: User[]
}
