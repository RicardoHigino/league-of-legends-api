import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const apiConfig = config.get('api');
  const app = await NestFactory.create(AppModule);

  await app.listen(apiConfig.port);
  logger.log(`Application listening on port: ${apiConfig.port}`);
}
bootstrap();
