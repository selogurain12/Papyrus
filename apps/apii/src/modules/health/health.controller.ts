/* eslint-disable no-unused-vars */
import { Controller, Get, HttpCode, Res } from "@nestjs/common";
import type { Response } from "express";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  public constructor(private readonly healthService: HealthService) {}

  @Get()
  @HttpCode(200)
  public async getHealth(@Res() response: Response) {
    const report = await this.healthService.check();
    return response.status(report.status === "ok" ? 200 : 503).json(report);
  }
}
