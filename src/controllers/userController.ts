import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { TaskService } from "../services/taskService";
import { message, userRegistration } from "../type";

export class UserController {
  static async intro(req: Request, res: Response): Promise<void> {
    try {
      const data = await TaskService.getAllTasks();
      res.render("intro.ejs", { data: data });
    } catch (error) {
      console.log("Error with get intro request :  ", error);
      res.status(500).send("Error with render page intro.ejs ");
    }
  }

  static async getLogin(req: any, res: Response): Promise<void> {
    try {
      res.status(201).render("login.ejs", { message: req.flash() });
    } catch (error) {
      console.log("Error with get login request :  ", error);
      res.status(500).send("Error with render page login.ejs ");
    }
  }

  static async getRegistration(req: any, res: Response): Promise<void> {
    try {
      res.status(201).render("registration.ejs", { message: req.flash() });
    } catch (error) {
      console.log("Error with get registration request :  ", error);
      res.status(500).send("Error with render page registration.ejs ");
    }
  }

  static async postRegistration(req: any, res: Response): Promise<void> {
    try {
      const input: userRegistration = req.body;
      const resoult: message = await UserService.createUser(input);

      if (resoult.status == "exist") {
        req.flash(resoult.status, resoult.message);
        res.redirect("registration");
      } else {
        req.flash(resoult.status, resoult.message);
        res.redirect("login");
      }
    } catch (error) {
      console.log("Error with post registration request :  ", error);
      res.status(500).send("Error with post registration form ");
    }
  }

  static async getTable(req: any, res: Response): Promise<void> {
    try {
      const user = {
        email: req.user.email,
        name: req.user.name,
      };
      const usersNames = (await UserService.getAllUsers()).join(", ");
      const allTaskSelectByUser = await TaskService.getAllTasks(req.user.name);

      res.status(200).render("table.ejs", {
        users: usersNames,
        data: allTaskSelectByUser,
        user: user,
      });
    } catch (error) {
      console.log("Error with get table request :  ", error);
      res.status(500).json("Failed to render page table.ejs ");
    }
  }
  static async updateTask(req: any, res: Response): Promise<void> {
    try {
      await TaskService.updateTask(req.body);
      res.status(201).redirect("/table");
    } catch (error) {
      console.log("Error with get updateTask request :  ", error);
      res.status(500).send("Error with post updateTask form ");
    }
  }

  static async createTask(req: any, res: Response): Promise<void> {
    try {
      await TaskService.createTask(req.body, req.user);
      res.status(201).redirect("/table");
    } catch (error) {
      console.log("Error with get createTask request :  ", error);
      res.status(500).send("Error with post createTable form ");
    }
  }

  static async logout(req: any, res: Response): Promise<void> {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout." });
      }
      res.redirect("/intro");
    });
  }
}
