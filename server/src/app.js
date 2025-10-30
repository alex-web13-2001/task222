import express from "express";
import cors from "cors";
import morgan from "morgan";

import apiRouter from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandlers.js";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

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

  return app;
};

export default createApp;
