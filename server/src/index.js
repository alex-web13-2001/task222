import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDatabase } from "./config/database.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandlers.js";
import apiRouter from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    name: "Task Manager API",
    version: "1.0.0",
    docs: "/api/docs"
  });
});

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

startServer();
