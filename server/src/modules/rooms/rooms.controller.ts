import { Controller, Get, HttpCode, HttpStatus, Inject, UseGuards } from '@nestjs/common'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { RoomsService } from './rooms.service'
@Controller('/api/rooms')
export class RoomControler {
	constructor(private readonly roomService: RoomsService) {}

	@UseGuards(AtGuard)
	@Get('/')
	@HttpCode(HttpStatus.CREATED)
	getRoomsForUser(@GetCurrentUser() userId: string): Promise<RoomEntity[]> {
		return this.roomService.getRoomsForUser(userId)
	}

	// @UseGuards(AtGuard)
	// @Post('/')
	// @HttpCode(HttpStatus.CREATED)
	// createRoom(@GetCurrentUserId() userId: string, @Body() dto: RoomDto): Promise<RoomEntity> {
	// 	return this.roomService.createRoom(dto, userId)
	// }

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
