import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Express } from "express";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3Service {
  private readonly s3 = new S3Client({
    region: process.env.AWS_REGION ?? "",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY ?? "",
      secretAccessKey: process.env.AWS_SECRET_KEY ?? "",
    },
  });

  async getSignedUrl(bucket: string, key: string) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }

  async uploadFile(file: Express.Multer.File, bucket: string) {
    const key = `${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    const signedUrl = await this.getSignedUrl(bucket, key);

    return { url: signedUrl };
  }
}
