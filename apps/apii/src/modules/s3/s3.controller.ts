import { Controller, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { s3Contract } from "@papyrus/source";
import { S3Service } from "./s3.service";

@Controller()
export class S3Controller {
  private readonly service: S3Service;

  public constructor(service: S3Service) {
    this.service = service;
  }

  @TsRestHandler(s3Contract.upload)
  @UseInterceptors(FileInterceptor("file"))
  public upload(@UploadedFile() file: Express.Multer.File) {
    return tsRestHandler(s3Contract.upload, async () => {
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
