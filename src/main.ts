import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { applyGlobalConfig } from './global-config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const swaggetConfig = new DocumentBuilder()
    .setTitle('NestJs Clean Arch')
    .setDescription('NestJs with clean archteture, DDD, Automated Tests')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Inform JWT to authorize',
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggetConfig);
  SwaggerModule.setup('api', app, document);

  await applyGlobalConfig(app);
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
