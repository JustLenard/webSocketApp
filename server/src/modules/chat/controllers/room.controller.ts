import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AtGuard } from 'src/common/guards/at.guard'
import { RoomDto } from '../dto/room.dto'
import { RoomEntity } from '../../../utils/entities/room.entity'
import { Mateservice } from '../service/room.service'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { UserEntity } from 'src/utils/entities/user.entity'

@Controller('/api/rooms')
export class RoomControler {
	constructor(private readonly roomService: Mateservice) {}

	@UseGuards(AtGuard)
	@Get('/')
	@HttpCode(HttpStatus.CREATED)
	getRoomsForUser(@GetCurrentUser() user: UserEntity): Promise<RoomEntity[]> {
		return this.roomService.getRoomsForUser(user.id)
	}

	@UseGuards(AtGuard)
	@Post('/')
	@HttpCode(HttpStatus.CREATED)
	createRoom(@Body() dto: RoomDto): Promise<RoomEntity> {
		return this.createRoom(dto)
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
