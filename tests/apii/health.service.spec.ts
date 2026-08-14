import { HealthService } from "../../apps/apii/src/modules/health/health.service";

describe("HealthService", () => {
  beforeEach(() => {
    process.env.EXPECTED_MIGRATION = "Migration20260720120000";
  });

  afterAll(() => {
    delete process.env.EXPECTED_MIGRATION;
  });
  it("returns ok when PostgreSQL, migrations and S3 are available", async () => {
    const execute = jest
      .fn()
      .mockResolvedValueOnce([{ "?column?": 1 }])
      .mockResolvedValueOnce([{ name: "Migration20260720120000" }]);
    const orm = { em: { getConnection: () => ({ execute }) } };
    const s3 = { checkAvailability: jest.fn().mockResolvedValue(undefined) };
    const service = new HealthService(orm as never, s3 as never);

    const report = await service.check();

    expect(report.status).toBe("ok");
    expect(report.checks.postgresql.status).toBe("ok");
    expect(report.checks.migrations.status).toBe("ok");
    expect(report.checks.s3.status).toBe("ok");
  });

  it("returns error when a dependency is unavailable", async () => {
    const execute = jest
      .fn()
      .mockResolvedValueOnce([{ "?column?": 1 }])
      .mockResolvedValueOnce([{ name: "Migration20260720120000" }]);
    const orm = { em: { getConnection: () => ({ execute }) } };
    const s3 = { checkAvailability: jest.fn().mockRejectedValue(new Error("S3 unavailable")) };
    const service = new HealthService(orm as never, s3 as never);

    const report = await service.check();

    expect(report.status).toBe("error");
    expect(report.checks.s3).toEqual(expect.objectContaining({ status: "error" }));
    expect(report.checks.s3).not.toHaveProperty("detail");
  });

  it("returns error when the latest expected migration is missing", async () => {
    const execute = jest
      .fn()
      .mockResolvedValueOnce([{ "?column?": 1 }])
      .mockResolvedValueOnce([{ name: "Migration20260101000000" }]);
    const orm = { em: { getConnection: () => ({ execute }) } };
    const s3 = { checkAvailability: jest.fn().mockResolvedValue(undefined) };
    const service = new HealthService(orm as never, s3 as never);

    const report = await service.check();

    expect(report.status).toBe("error");
    expect(report.checks.migrations.status).toBe("error");
  });
});
