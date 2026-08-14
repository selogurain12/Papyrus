import { Injectable } from "@nestjs/common";
import { HeadBucketCommand, S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Express } from "express";

@Injectable()
export class S3Service {
  private s3?: S3Client;

  private getClient(): S3Client {
    if (!this.s3) {
      const region = process.env.AWS_REGION;
      const accessKeyId = process.env.AWS_ACCESS_KEY;
      const secretAccessKey = process.env.AWS_SECRET_KEY;
      if (!region || !accessKeyId || !secretAccessKey) {
        throw new Error("AWS S3 not configured: set AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY");
      }
      this.s3 = new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
      });
    }
    return this.s3;
  }

  async uploadFile(file: Express.Multer.File, bucket: string) {
    const safeFileName = file.originalname
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${Date.now()}-${safeFileName}`;

    const s3 = this.getClient();
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { url };
  }

  async checkAvailability(): Promise<void> {
    const bucket = process.env.AWS_BUCKET;
    if (!bucket) throw new Error("AWS_BUCKET not configured");
    await this.getClient().send(new HeadBucketCommand({ Bucket: bucket }));
  }
}
