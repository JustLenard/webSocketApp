import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Logger, Post, UseGuards } from '@nestjs/common'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { RoomsService } from './rooms.service'
import { UserEntity } from 'src/utils/entities/user.entity'
import { CreateRoomDto } from './dto/create-room.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { appEmitters } from 'src/utils/constants'
@Controller('/api/rooms')
export class RoomControler {
	constructor(private readonly roomService: RoomsService, private readonly eventEmitter: EventEmitter2) {}

	@UseGuards(AtGuard)
	@Get('/')
	@HttpCode(HttpStatus.CREATED)
	getRoomsForUser(@GetCurrentUser() user: UserEntity) {
		return this.roomService.getRoomsForUser(user.id)
	}

	private logger: Logger = new Logger('Room Service')

	@UseGuards(AtGuard)
	@Post('/')
	@HttpCode(HttpStatus.CREATED)
	async createRoom(@GetCurrentUser() user: UserEntity, @Body() dto: CreateRoomDto) {
		const privateChat = await this.roomService.checkIfPrivateChatExits(user.id, dto.users[0])
		console.log('This is user', user)
		console.log('This is dto', dto)
		console.log('This is privateChat', privateChat)

		if (!privateChat) {
			const newRoom = await this.roomService.createRoom(dto, user)
			this.eventEmitter.emit(appEmitters.roomCreate, { room: newRoom, creatorId: user.id })
			return newRoom
		}

		this.logger.warn('Room already exists. Aborting')
		return privateChat
	}

	// @UseGuards(AtGuard)
	// @Patch('/')
	// @HttpCode(HttpStatus.OK)
	//   updateRoom(@Body() dto: RoomDto, @Res({ passthrough: true }) res: Response): Promise<Tokens> {
	// 	return this.roomService.signinLocal(dto, res)
	// }

	// @UseGuards(AtGuard)
	// @Delete('/')
	// @HttpCode(HttpStatus.OK)
	//  deleteRoom(@Body() dto: RoomDto, @Res({ passthrough: true }) res: Response): Promise<Tokens> {
	// 	return this.roomService.async signinLocal(dto, res)
	// }
}
