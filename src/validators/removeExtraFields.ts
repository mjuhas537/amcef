import { Request, Response, NextFunction } from "express";

export class RemoveExtraFields {
  static registration = (req: Request, res: Response, next: NextFunction) => {
    const whitelistFields = ["name", "email", "password"];
    Object.keys(req.body).forEach((key) => {
      if (!whitelistFields.includes(key)) {
        delete req.body[key];
      }
    });
    next();
  };

  static login = (req: Request, res: Response, next: NextFunction) => {
    const whitelistFields = ["email", "password"];
    Object.keys(req.body).forEach((key) => {
      if (!whitelistFields.includes(key)) {
        delete req.body[key];
      }
    });
    next();
  };
  static createTask = (req: Request, res: Response, next: NextFunction) => {
    const whitelistFields = [
      "title",
      "description",
      "author",
      "deadline",
      "flag",
      "user",
    ];
    Object.keys(req.body).forEach((key) => {
      if (!whitelistFields.includes(key)) {
        delete req.body[key];
      }
    });
    next();
  };
  static updateTask = (req: Request, res: Response, next: NextFunction) => {
    const whitelistFields = [
      "id",
      "title",
      "description",
      "author",
      "deadline",
      "flag",
      "member",
    ];
    Object.keys(req.body).forEach((key) => {
      if (!whitelistFields.includes(key)) {
        delete req.body[key];
      }
    });
    next();
  };
}
