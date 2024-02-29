import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { NestExpressApplication } from '@nestjs/platform-express';
import { winstonConfig } from './common/configs/winston.config';
import { PrismaService } from './common/services/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(WinstonModule.createLogger(winstonConfig));
  // Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(3000);
}
bootstrap();
