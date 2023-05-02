import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const configService = app.get(ConfigService);

  const logger = new Logger();

  const port = configService.get<number>('PORT', 3001);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Sync In')
    .setDescription('The Sync In is Hroza-bydlo team product')
    .setVersion('1.0')
    .addTag('Sync In')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://root:root@localhost:5672/root'],
        queue: 'test',
        queueOptions: {
          durable: true,
        },
      },
    });
  await microservice.listen();

  await app.listen(port, () => {
    logger.log(`Server running on port: ${port}`, 'Server');
  });
}

bootstrap();
