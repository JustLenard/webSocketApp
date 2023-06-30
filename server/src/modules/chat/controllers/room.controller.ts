import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Res, UseGuards } from '@nestjs/common'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { Response } from 'express'
import { RtGuard } from 'src/common/guards/rt.guard'
import { Tokens } from 'src/types/tokens.types'
import { RoomDto } from '../dto/room.dto'
import { RoomService } from '../service/room.service'
import { RoomI } from 'src/types/entities.types'
import { RoomEntity } from '../entities/room.entity'

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
