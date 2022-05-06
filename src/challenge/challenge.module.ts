import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Challenge, ChallengeCompletion } from 'src/models/Challenge';

@Module({
  imports: [SequelizeModule.forFeature([Challenge, ChallengeCompletion])],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
