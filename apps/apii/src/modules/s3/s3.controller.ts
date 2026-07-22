import { BadRequestException, Controller, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { s3Contract } from "@papyrus/source";
import { S3Service } from "./s3.service";

const allowedMimeTypes = new Set([
  "application/epub+zip",
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/webm",
]);

@Controller()
export class S3Controller {
  private readonly service: S3Service;

  public constructor(service: S3Service) {
    this.service = service;
  }

  @TsRestHandler(s3Contract.upload)
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (_request, file, callback) => {
        if (allowedMimeTypes.has(file.mimetype)) {
          callback(null, true);
          return;
        }

        callback(new BadRequestException("Unsupported file type"), false);
      },
    })
  )
  public upload(@UploadedFile() file?: Express.Multer.File) {
    return tsRestHandler(s3Contract.upload, async () => {
      if (!file) {
        throw new BadRequestException("File is required");
      }

      const bucket = process.env.AWS_BUCKET;
      if (!bucket) {
        throw new Error("AWS_BUCKET manquant");
      }

      const result = await this.service.uploadFile(file, bucket);

      return {
        status: 200,
        body: result,
      };
    });
  }
}
