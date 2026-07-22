import * as path from "path";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module";

dotenv.config();

const rateLimitWindowMs = 60_000;
const rateLimitMaxRequests = 300;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function securityHeaders(_request: Request, response: Response, next: NextFunction) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; object-src 'none'"
  );
  next();
}

function rateLimit(request: Request, response: Response, next: NextFunction) {
  const now = Date.now();
  const key = request.ip ?? request.socket.remoteAddress ?? "unknown";
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    next();
    return;
  }

  if (current.count >= rateLimitMaxRequests) {
    response.status(429).json({ message: "Too many requests" });
    return;
  }

  current.count += 1;
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(securityHeaders);
  app.use(rateLimit);
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

  await app.listen(Number(process.env.PORT ?? 3000), "0.0.0.0");
}

void bootstrap();
