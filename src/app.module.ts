import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChallengeModule } from './challenge/challenge.module';
import { UserModule } from './user/user.module';
import { ExerciceModule } from './exercice/exercice.module';

@Module({
  imports: [ChallengeModule, UserModule, ExerciceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
