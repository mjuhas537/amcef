import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Task } from "./entity/Task";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "miro",
  database: "postgres",
  synchronize: false,
  logging: false,
  entities: [User, Task],
  migrations: ["./src/migration/*.ts"],
});
