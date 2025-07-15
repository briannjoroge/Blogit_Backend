import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getUserBlogs = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.userId;

  try {
    const blogs = await prisma.post.findMany({
      where: {
        authorId: userId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
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
    res.status(500).json({ message: "Failed to fetch user blogs" });
  }
};

export const updateUserInfo = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.userId;
  const { firstName, lastName, username, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, username, email },
    });

    res.status(200).json({
      message: "User information updated",
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch {
    res.status(400).json({ message: "Failed to update profile data!" });
  }
};

export const updateUserPassword = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both passwords are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ messahe: "User not found!" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch {
    res.status(500).json({ error: "Password update failed" });
  }
};
