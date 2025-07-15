import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../controllers/blogControllers";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllBlogs);
router.get("/:blogId", getBlogById);
router.post("/", verifyToken, createBlog);
router.patch("/:blogId", verifyToken, updateBlog);
router.delete("/:blogId", verifyToken, deleteBlog);

export default router;
