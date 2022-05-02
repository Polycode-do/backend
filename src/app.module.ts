import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChallengeModule } from './challenge/challenge.module';
import { UserModule } from './user/user.module';
import { ExerciceModule } from './exercice/exercice.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ChallengeModule,
    UserModule,
    ExerciceModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'postgres',
      autoLoadModels: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
