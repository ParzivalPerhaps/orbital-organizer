import express from "express";
import * as UserController from "../controllers/user";

const router = express.Router();

router.get("/:userId")
router.put("/auth/login", UserController.loginUser);
router.put("/auth/signup", UserController.signupUser);

export default router;