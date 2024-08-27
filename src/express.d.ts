import "express";
import { User } from "./entities/User";

declare module "express-serve-static-core" {
  interface Request {
    user?: User; // Alebo nahraďte `any`
  }

  interface Request {
    logout: (err: any) => void;
  }
}
