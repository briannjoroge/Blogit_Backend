import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const createBlog = async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req as any).userId;
  const { featuredImage, title, synopsis, content } = req.body;

  if (!featuredImage || !title || !content || !synopsis) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const blog = await prisma.post.create({
      data: {
        featuredImage,
        title,
        synopsis,
        content,
        authorId: userId,
      },
    });

    res.status(200).json({ message: "Blog created", blog });
  } catch (err: any) {
    console.error("Create blog error:", err);
    res
      .status(500)
      .json({ error: "Failed to create blog", details: err.message });
  }
};

export const getAllBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await prisma.post.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json({ blogs });
  } catch {
    res.status(400).json({ error: "Failed to fetch blogs" });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  const blogId = req.params.blogId;

  try {
    const blog = await prisma.post.findUnique({
      where: { id: blogId },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    if (!blog || blog.isDeleted) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ blog });
  } catch {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

export const updateBlog = async (req: AuthenticatedRequest, res: Response) => {
  const blogId = req.params.blogId;

  const { title, synopsis, content, featuredImage } = req.body;

  if (!featuredImage || !title || !content || !synopsis) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const blogExist = await prisma.post.findUnique({
      where: { id: blogId },
    });

    if (!blogExist) {
      return res.status(404).json({ message: "Blog does not exist!" });
    }

    const updatedBlog = await prisma.post.update({
      where: { id: blogId },
      data: { title, synopsis, content, featuredImage, updatedAt: new Date() },
    });

    res.status(200).json({ message: "Blog updated", blog: updatedBlog });
  } catch {
    res.status(500).json({ error: "Failed to update blog" });
  }
};

export const deleteBlog = async (req: AuthenticatedRequest, res: Response) => {
  const blogId = req.params.blogId;

  try {
    const blog = await prisma.post.findUnique({ where: { id: blogId } });

    if (!blog) {
      return res.status(404).json({ message: "Blog does not exist!" });
    }

    await prisma.post.update({
      where: { id: blogId },
      data: { isDeleted: true, updatedAt: new Date() },
    });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch {
    res.status(500).json({ nessage: "Failed to delete blog" });
  }
};
