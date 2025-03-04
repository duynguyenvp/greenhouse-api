import "reflect-metadata";
import "dotenv/config";

import express from "express";
import http from "http";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import api from "./apis";
import {
  responseFormatter,
  errorHandler,
  notFound,
} from "./middlewares/response";
import dataSource from "./db/dataSource";
import logger from "./logger";
import compression from "@polka/compression";

const port = process.env.PORT || 5000;

async function start() {
  const app = express();
  const httpServer = http.createServer(app);

  dataSource
    .initialize()
    .then(async () => {
      logger.info("DataSource initialize successfully.");
    })
    .catch(error =>
      logger.error("Error during DataSource initialization:", error)
    );

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(compression());

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(responseFormatter);
  app.get("/", (_req, res) => {
    res.json({
      message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄"
    });
  });
  
  app.use("/api/v1", api);
  app.use(notFound);
  app.use(errorHandler);

  // Modified server startup
  await new Promise(resolve =>
    httpServer.listen({ port: port }, resolve as () => void)
  );
  logger.info(`Server is listening on port ${port}!`);
}

start().catch(err => logger.error("Server startup error:", err));
