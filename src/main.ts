import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, 
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Dokumentatsiyasi') 
    .setDescription('Ilova uchun API tavsifi') 
    .setVersion('1.0') 
    .addBearerAuth() 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT ?? 3000, () => {
    console.log(`Server is running on port ${PORT ?? 3000}`);
  });
}
bootstrap();
