import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/User';
import { ExerciseCompletion } from 'src/models/Exercise';

@Module({
  imports: [SequelizeModule.forFeature([User, ExerciseCompletion])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
