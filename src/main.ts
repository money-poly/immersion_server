import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from "@nestjs/swagger";
import * as path from "path";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as expressBasicAuth from "express-basic-auth";
import { HttpExceptionFilter } from "./aop/exception/http-exception.filter";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Swagger
  app.use(
    ["/api-docs", "/api-docs-json"],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    })
  );
  const config = new DocumentBuilder()
    .setTitle("IMMERSION")
    .setDescription("The immersion API description")
    .setVersion("1.0")
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`listening on port ${port}`);
}
bootstrap();
