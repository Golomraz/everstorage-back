import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4200', 'https://golomraz.github.io'],
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
  });
  await app.listen(3000);
}
bootstrap();
