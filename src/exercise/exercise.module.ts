import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Exercise, ExerciseCompletion } from 'src/models/Exercise';
import { ChallengeService } from 'src/challenge/challenge.service';
import { Challenge, ChallengeCompletion } from 'src/models/Challenge';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Exercise,
      ExerciseCompletion,
      Challenge,
      ChallengeCompletion,
    ]),
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService, ChallengeService],
})
export class ExerciseModule {}
