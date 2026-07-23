import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

export function loadApiEnv() {
  const candidates = [
    path.resolve(process.cwd(), "apps/apii/.env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../../apps/apii/.env"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      dotenv.config({ path: candidate });
    }
  }
}
