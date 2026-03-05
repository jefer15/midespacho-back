import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const publicDir = join(process.cwd(), 'public');
  if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: "GET, POST, PUT, PATCH, DELETE",
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
