import cors from "cors";
import express from "express";
import helmet from "helmet";
import { firebaseConfigured } from "./config/firebase.js";

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  },
}));
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "rehab-ai-backend",
    firebaseConfigured,
  });
});

app.use((_request, response) => {
  response.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found." } });
});

app.use((error, _request, response, _next) => {
  const status = error.message === "Origin is not allowed by CORS." ? 403 : 500;
  response.status(status).json({
    error: {
      code: status === 403 ? "ORIGIN_NOT_ALLOWED" : "INTERNAL_ERROR",
      message: status === 403 ? "This origin is not allowed." : "An unexpected error occurred.",
    },
  });
});

export default app;
