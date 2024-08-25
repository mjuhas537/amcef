import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();
const passport = require("passport");

router.get("/intro", UserController.intro);
router.get("/login", UserController.getLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/table",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.get("/registration", UserController.getRegistration);
router.post("/registration", UserController.postRegistration);
router.get("/table", UserController.getTable);
router.post("/updateTask", UserController.updateTask);
router.post("/createTask", UserController.createTask);
router.get("/logout", UserController.logout);

export default router;
