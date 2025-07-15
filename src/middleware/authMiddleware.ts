import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "superSecureKey123";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    req.userId = decoded.userId;

    next();
  } catch {
    res.status(400).json({ message: "Token is invalid!" });
  }
};
