import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AtGuard } from 'src/common/guards/at.guard'
import { RoomDto } from '../dto/room.dto'
import { RoomEntity } from '../../../utils/entities/room.entity'
import { RoomService } from '../service/room.service'

@Controller('/api/rooms')
export class RoomControler {
	constructor(private readonly roomService: RoomService) {}

	@UseGuards(AtGuard)
	@Get('/')
	@HttpCode(HttpStatus.CREATED)
	getRoomsForUser(): Promise<RoomEntity[]> {
		return this.getRoomsForUser()
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
