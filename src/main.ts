import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './module/app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/nest';
    logger.log(`MongoDB URI: ${mongoUri}`);

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(process.env.NODE_ENV);

    logger.log(`Application is running on port ${port}`);
    logger.log(`MongoDB connection established successfully`);
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error(`Failed to start application: ${error.message}`);
    process.exit(1);
  }
}

bootstrap();
