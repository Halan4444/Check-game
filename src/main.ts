import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {mongodbLocal} from "./config/mongoDB.config";
import {json, urlencoded} from "express";



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('RealEstate manager API')
      .setDescription('Quiz manager API description')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();



