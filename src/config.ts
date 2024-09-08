import { logger } from "./logger/logger";

require("dotenv").config();

// Získanie hodnoty premennej prostredia 'NODE_ENV'
const nodeEnv = process.env.NODE_ENV;

let host: string;
let password: string;

if (nodeEnv === "docker") {
  host = process.env.DOCKER_POSTGRES_HOST as string;
  password = process.env.DOCKER_POSTGRES_PASSWORD as string;
} else {
  host = process.env.LOCAL_POSTGRES_HOST as string;
  password = process.env.LOCAL_POSTGRES_PASSWORD as string;
}

logger.info(`NODE_ENV: ${nodeEnv || "local"}, DB: host: ${host}`);

export { host, password };
