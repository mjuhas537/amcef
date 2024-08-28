import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateLocal } from "../middlewares/authentication/authenticateUser";
import { Validate } from "../validators/validator";
import validationResultHandler from "../validators/validationResultHandler";
import { RemoveExtraFields } from "../validators/removeExtraFields";

const router = Router();

router.get("/intro", UserController.intro);
router.get("/login", UserController.getLogin);
router.post(
  "/login",
  RemoveExtraFields.login,
  Validate.loggin,
  validationResultHandler,
  authenticateLocal
);
router.get("/registration", UserController.getRegistration);
router.post(
  "/registration",
  RemoveExtraFields.registration,
  Validate.registration,
  validationResultHandler,
  UserController.postRegistration
);
router.get("/table", UserController.getTable);
router.post(
  "/updateTask",
  RemoveExtraFields.updateTask,
  Validate.updateTask,
  validationResultHandler,
  UserController.updateTask
);
router.post(
  "/createTask",
  RemoveExtraFields.createTask,
  Validate.createTask,
  validationResultHandler,
  UserController.createTask
);
router.get("/logout", UserController.logout);

export default router;
