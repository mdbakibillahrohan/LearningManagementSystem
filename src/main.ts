import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

   // 🔧 Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('Learning Managment System')
    .setDescription('API documentation for Learning Management System')
    .setVersion('1.0')
    .addTag('users') // Optional: for grouping routes
    .build();

  // 📘 Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // 🌐 Setup Swagger UI route
  SwaggerModule.setup('api', app, document);

  console.log("PORT IS ",process.env.PORT)

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
