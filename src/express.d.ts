import "express";
import { User } from "./entities/User";

declare module "express-serve-static-core" {
  interface Request {
    user: User; // Alebo nahraďte `any` konkrétnym typom vašej `user` objektu
  }

  interface Request {
    logout: (err: any) => void;
  }
}
