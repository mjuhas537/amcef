import path = require("path");
import bcrypt = require("bcrypt");
import { AppDataSource } from "./data-source";
import {
  createTask,
  createUser,
  findUserById,
  findUserByEmail,
  getAllTasks,
  getAllUsers,
  updateTask,
  checkAuthenticated,
} from "./database/utils";
import {
  reqUpdateTask,
  reqCreateTask,
  userRegistration,
  message,
} from "./type";
import { Task } from "./entity/Task";
import { User } from "./entity/User";

const express = require("express");
const app = express();
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "./views")));
app.use(flash());
app.use(
  session({
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

initializePassport(
  passport,
  (email: string) => findUserByEmail(email),
  (id: string) => findUserById(id)
);
async function main() {
  AppDataSource.initialize()
    .then(async () => {
      console.log("Connected to database.");

      app.get(
        "/intro",
        async (
          req: any,
          res: { render: (arg0: string, arg1: { data: Task[] }) => void }
        ) => {
          res.render("intro.ejs", { data: await getAllTasks() });
        }
      );

      app.get(
        "/login",
        (
          req: { flash: () => any },
          res: { render: (arg0: string, arg1: { message: any }) => void }
        ) => {
          res.render("login.ejs", { message: req.flash() });
        }
      );

      app.post(
        "/login",
        passport.authenticate("local", {
          successRedirect: "/table",
          failureRedirect: "/login",
          failureFlash: true,
        })
      );

      app.get(
        "/registration",
        (
          req: { flash: () => any },
          res: { render: (arg0: string, arg1: { message: any }) => void }
        ) => {
          res.render("registration.ejs", { message: req.flash() });
        }
      );

      app.post(
        "/registration",
        async function (
          req: {
            body: userRegistration;
            flash: (arg0: string, arg1: string) => void;
          },
          res: { redirect: (arg0: string) => void }
        ) {
          const input: userRegistration = req.body;
          //
          // este dopln validaciu vtupnych dat skus express-validator

          try {
            input.password = await bcrypt.hash(input.password, 10);
          } catch (e) {
            console.log("Error with hash password: ", e);
          }
          const resoult: message = await createUser(input);

          if (resoult.status == "exist") {
            req.flash(resoult.status, resoult.message);
            res.redirect("registration");
          } else {
            req.flash(resoult.status, resoult.message);
            res.redirect("login");
          }
        }
      );

      app.get(
        "/table",
        checkAuthenticated,
        async function (
          req: { user: { email: string; name: string } },
          res: {
            render: (
              arg0: string,
              arg1: {
                users: string;
                data: Task[];
                user: { email: string; name: string };
              }
            ) => void;
          }
        ) {
          const user = {
            email: req.user.email,
            name: req.user.name,
          };
          res.render("table.ejs", {
            users: (await getAllUsers()).join(", "),
            data: await getAllTasks(req.user.name),
            user: user,
          });
        }
      );

      app.post(
        "/updateTask",
        checkAuthenticated,
        async (
          req: { body: reqUpdateTask },
          res: { redirect: (arg0: string) => void }
        ) => {
          await updateTask(req.body);
          res.redirect("/table");
        }
      );

      app.post(
        "/createTask",
        checkAuthenticated,
        async (
          req: { body: reqCreateTask; user: User },
          res: { redirect: (arg0: string) => void }
        ) => {
          await createTask(req.body, req.user);
          res.redirect("/table");
        }
      );

      app.get(
        "/logout",
        (
          req: { logout: (arg0: (err: any) => any) => void },
          res: {
            status: (arg0: number) => {
              (): any;
              new (): any;
              json: { (arg0: { message: string }): any; new (): any };
            };
            redirect: (arg0: string) => void;
          }
        ) => {
          req.logout((err: any) => {
            if (err) {
              return res.status(500).json({ message: "Error during logout." });
            }
            res.redirect("/intro");
          });
        }
      );

      app.listen(3000, () => console.log("Server run at port locallhost:3000"));
    })
    .catch((error) => console.log(error));
}

main();
