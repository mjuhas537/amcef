import path = require("path");
import UserRoutes from "./routes/userRoutes";
import { UserService } from "./services/userService";
import { checkAuthenticated } from "./middlewares/authentication/checkAuthenticated";
import rateLimiter from "./middlewares/rateLimiter/rateLimiter";

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
initializePassport(
  passport,
  (email: string) => UserService.findUser({ email: email }),
  (id: string) => UserService.findUser({ id: id })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(rateLimiter);
app.use(express.json());
app.use("/table", checkAuthenticated);
app.use("/updateTask", checkAuthenticated);
app.use("/createTask", checkAuthenticated);
app.use("", UserRoutes);

export default app;
