import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Exercise, ExerciseCompletion } from 'src/models/Exercise';
import { ChallengeService } from 'src/challenge/challenge.service';

@Module({
  imports: [SequelizeModule.forFeature([Exercise, ExerciseCompletion])],
  controllers: [ExerciseController],
  providers: [ExerciseService, ChallengeService],
})
export class ExerciseModule {}
