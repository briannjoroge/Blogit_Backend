import { Router } from "express";
import {
  defaultScreen,
  loginUser,
  registerUser,
} from "../controllers/authController";

const router = Router();

router.post("/", defaultScreen);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
