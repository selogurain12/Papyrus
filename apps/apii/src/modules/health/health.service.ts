/* eslint-disable no-unused-vars */
import { Injectable, Logger } from "@nestjs/common";
import { MikroORM } from "@mikro-orm/postgresql";
import { S3Service } from "../s3/s3.service";

type Check = { status: "ok" | "error"; durationMs: number };

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  public constructor(
    private readonly orm: MikroORM,
    private readonly s3: S3Service
  ) {}

  private async measure(name: string, operation: () => Promise<void>): Promise<Check> {
    const startedAt = Date.now();
    try {
      await operation();
      return { status: "ok", durationMs: Date.now() - startedAt };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Health check failed: ${name}`, message);
      return { status: "error", durationMs: Date.now() - startedAt };
    }
  }

  public async check() {
    const connection = this.orm.em.getConnection();
    const [postgresql, migrations, s3] = await Promise.all([
      this.measure("postgresql", async () => void (await connection.execute("select 1"))),
      this.measure("migrations", async () => {
        const expectedMigration = process.env.EXPECTED_MIGRATION;
        if (!expectedMigration) throw new Error("EXPECTED_MIGRATION is not configured");
        const rows = await connection.execute<{ name: string }[]>(
          "select name from mikro_orm_migrations order by executed_at desc limit 1"
        );
        if (rows[0]?.name !== expectedMigration) throw new Error("Database schema is outdated");
      }),
      this.measure("s3", async () => this.s3.checkAvailability()),
    ]);
    const checks = { postgresql, migrations, s3 };
    const status = Object.values(checks).every((check) => check.status === "ok") ? "ok" : "error";
    return {
      status,
      version: process.env.APP_VERSION ?? "1.0.1",
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
