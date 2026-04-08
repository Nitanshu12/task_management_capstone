require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const net = require("net");

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Security headers
app.use(helmet());

// CORS — restrict to frontend origin in production
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Centralized error handler (must be last)
app.use(errorHandler);

// Function to find a free port starting from default
const DEFAULT_PORT = process.env.PORT || 5000;
function getFreePort(port, callback) {
  const server = net.createServer();
  server.listen(port, () => {
    server.close(() => callback(port));
  });
  server.on("error", () => getFreePort(port + 1, callback));
}

// Start server
getFreePort(DEFAULT_PORT, (port) => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
