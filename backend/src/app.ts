import express from "express";
import { pool } from "./db";
import { errorHandler, notFoundHandler } from "./errors";
import { userRoutes } from "./users/userRoutes";
import { weatherRoutes } from "./weather/weatherRoutes";
import { readFileSync } from "node:fs";
import swaggerUi from "swagger-ui-express";
import { parse } from "yaml";

export const app = express();

const openApiDocument = parse(
  readFileSync(new URL("../openapi.yaml", import.meta.url), "utf8"),
);

app.use(express.json());

app.get("/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok" });
});

app.use("/users", userRoutes);
app.use("/weather", weatherRoutes);

app.get("/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(notFoundHandler);
app.use(errorHandler);
