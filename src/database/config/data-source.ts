import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Task } from "../entities/Task";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  logging: false,
  entities: [User, Task],
  //localne ts-node bez buildu
  // migrations: ["./src/database/migration/*.ts"],
  // pre docker, resp ked spustam compilovany js projekt , nie ces ts-node  *.ts
  migrations: ["./build/database/migration/*.js"],
});
