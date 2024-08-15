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
  getAllTasksFromUser,
} from "./database/utils";

var bodyParser = require("body-parser");
const express = require("express");
const app = express();
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
app.use(express.urlencoded({ extended: false }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
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
  (email) => findUserByEmail(email),
  (id) => findUserById(id)
);
async function main() {
  AppDataSource.initialize()
    .then(async () => {
      console.log("Connected to database.");

      app.get("/intro", async (req, res) => {
        const table = await getAllTasks();
        res.render("intro.ejs", { data: table });
      });

      app.get("/login", (req, res) => {
        res.render("login.ejs", { message: req.flash() });
      });

      app.post(
        "/login",
        passport.authenticate("local", {
          successRedirect: "/table",
          failureRedirect: "/login",
          failureFlash: true,
        })
      );

      app.get("/registration", (req, res) => {
        res.render("registration.ejs", { message: req.flash() });
      });

      app.post("/registration", async function (req, res) {
        const password = req.body.password;

        try {
          const hashPassword = await bcrypt.hash(password, 10);
          req.body.password = hashPassword;
        } catch (e) {
          console.log(e);
        }

        const newUser = await createUser(req.body);

        if (newUser.status == "exist") {
          req.flash(newUser.status, newUser.message);
          res.redirect("registration");
        } else {
          req.flash(newUser.status, newUser.message);
          res.redirect("login");
        }
      });

      app.get("/table", checkAuthenticated, async function (req, res) {
        const table = await getAllTasksFromUser(req.user.name);
        const members = await getAllUsers();
        const nameOfmembers = members.map((member) => member.name).join(", ");
        const user = { email: req.user.email, name: req.user.name };

        res.render("table.ejs", {
          users: nameOfmembers,
          data: table,
          user: user,
        });
      });

      app.post("/updateTask", checkAuthenticated, async (req, res) => {
        await updateTask(req.body);
        res.redirect("/table");
      });

      app.post("/createTask", checkAuthenticated, async (req, res) => {
        await createTask(req.body, req.user);
        res.redirect("/table");
      });

      app.get("/logout", (req, res) => {
        req.logout((err) => {
          if (err) {
            return res.status(500).json({ message: "Error during logout." });
          }
          res.redirect("/intro");
        });
      });

      app.listen(3000, () => console.log("Server run at port locallhost:3000"));
    })
    .catch((error) => console.log(error));
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/intro");
}

main();
