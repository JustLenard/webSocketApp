import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';

export const typeOrm: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'mysecretpassword',
  database: 'Users',
  entities: [User],
  synchronize: true,
};
