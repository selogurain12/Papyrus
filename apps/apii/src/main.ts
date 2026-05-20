import * as path from "path";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import * as express from "express";
import { AppModule } from "./app.module";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use("/exports", express.static(path.join(process.cwd(), "exports")));

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.useGlobalPipes(new ValidationPipe());

  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "https://papyrus-xxdv.onrender.com",
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Swagger")
    .addBearerAuth()
    .setDescription("The API description")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}

void bootstrap();
