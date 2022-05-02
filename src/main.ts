import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  //Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Polycode API')
    .setDescription('API description for Polycode main API')
    .setVersion(process.env.APP_VERSION || '0.1.0')
    .addTag('user', 'User related operations')
    .addTag('challenge', 'Challenge related operations')
    .addTag('exercise', 'Exercise related operations')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
