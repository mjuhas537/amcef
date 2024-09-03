import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Task } from "../entities/Task";
import { host, password } from "../../config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: host,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: password,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  logging: false,
  entities: [User, Task],
  migrations: ["./build/database/migration/*.{js,ts}"],
});
