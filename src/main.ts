import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string | number>('PORT') ?? 3000;
  await app.listen(port);
  Logger.log(`Server is running on port ${port}`);
}
void bootstrap();
