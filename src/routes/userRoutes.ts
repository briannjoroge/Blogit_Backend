import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import {
  getUserBlogs,
  updateUserInfo,
  updateUserPassword,
} from "../controllers/userController";

const router = Router();

router.get("/user/blogs", verifyToken, getUserBlogs);
router.put("/", verifyToken, updateUserInfo);
router.put("/password", verifyToken, updateUserPassword);

export default router;
