import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import coursesRoutes from "./routes/courses";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use(morgan("combined"));

// Routes
app.use("/auth", authRoutes);
app.use("/courses", coursesRoutes);

// Health check

// 404 handler
app.use((_, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(
  (
    err: any,
    _: express.Request,
    res: express.Response,
    __: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
