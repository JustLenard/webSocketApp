import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UsersService],
})
export class UsersModule {}
