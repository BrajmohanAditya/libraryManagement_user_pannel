import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Library Management API')
    .setVersion('1.0')
    .addBearerAuth() // Use this if you're using JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`Server is running on port ${port}`);
}

bootstrap();