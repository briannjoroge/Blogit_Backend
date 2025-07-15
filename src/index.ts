import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import blogRoutes from "./routes/blogRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // or whatever your frontend URL is
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
