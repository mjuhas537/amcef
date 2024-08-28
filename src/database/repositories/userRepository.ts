import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";

export const userRepository = AppDataSource.getRepository(User);
export const taskRepository = AppDataSource.getRepository(Task);
