/**
 * @fileoverview Main application entry point for the API service.
 * This service provides search functionality over indexed documents.
 *
 * Features:
 * - Document search with fuzzy matching
 * - Health check endpoint for monitoring
 * - CORS enabled for cross-origin requests
 * - Request body parsing for JSON payloads
 *
 * Environment Variables:
 * - PORT: Server port number (default: 3001)
 */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import searchRoutes from "./routes/search.routes";
import { PORT } from "./constants/app.constants";
import { logInfo, logError } from "./utils/logger";

const app = express();

// Configure CORS based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === "development" ? "*" : process.env.UI_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api", searchRoutes);

/**
 * Health check endpoint
 * Returns server status and current timestamp
 *
 * @route GET /health
 * @returns {Object} Status object
 * @returns {string} status - Always 'ok' if server is running
 * @returns {string} timestamp - Current ISO timestamp
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logError("Unhandled error", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
);

// Start server
app.listen(PORT, () => {
  logInfo("Server started", {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
  });
});
