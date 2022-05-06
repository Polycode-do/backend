import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/User';
import { ExerciseCompletion } from 'src/models/Exercise';
import { ChallengeCompletion } from 'src/models/Challenge';

@Module({
  imports: [
    SequelizeModule.forFeature([User, ExerciseCompletion, ChallengeCompletion]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
