import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT ?? 3000, () => {
    console.log(`Server is running on port ${PORT ?? 3000}`);
  });
}
bootstrap();
