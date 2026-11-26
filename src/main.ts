import './config/env.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './config/prisma-exception.filter.js';


expand(dotenv.config());
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new PrismaExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
