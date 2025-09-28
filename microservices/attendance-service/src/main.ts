import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3003);
  console.log('Attendance Service running on port 3003');
}
bootstrap();
