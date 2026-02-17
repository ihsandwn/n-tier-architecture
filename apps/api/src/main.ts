import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    // Security Headers
    app.use(helmet());

    // CORS configuration
    const nodeEnv = process.env.NODE_ENV || 'development';
    const corsOrigin =
      nodeEnv === 'production'
        ? process.env.FRONTEND_URL || 'http://localhost'
        : '*';

    app.enableCors({
      origin: corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 3600,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Global API prefix
    app.setGlobalPrefix('api/v1');

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');

    logger.log(`✅ Application started successfully`);
    logger.log(`🚀 API running on port ${port}`);
    logger.log(`📝 Environment: ${nodeEnv}`);
    logger.log(`🔗 API Prefix: /api/v1`);
  } catch (error) {
    logger.error('❌ Application failed to start', error);
    process.exit(1);
  }
}

bootstrap();
