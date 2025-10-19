import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

   // 🔧 Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('My NestJS API')
    .setDescription('API documentation for my project')
    .setVersion('1.0')
    .addTag('users') // Optional: for grouping routes
    .build();

  // 📘 Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // 🌐 Setup Swagger UI route
  SwaggerModule.setup('api', app, document);

  app.use(new ValidationPipe());

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
