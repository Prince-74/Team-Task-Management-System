const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Configure CORS: normalize CLIENT_URL (supports comma-separated origins),
// trim trailing slashes and ensure protocol. If CLIENT_URL is not set,
// allow all origins (useful for local development).
const normalize = (u) => {
  if (!u) return "";
  let s = u.trim();
  if (s.endsWith("/")) s = s.slice(0, -1);
  if (!s.startsWith("http://") && !s.startsWith("https://")) s = `https://${s}`;
  return s;
};

const clientUrlEnv = process.env.CLIENT_URL || "";
const allowedOrigins = clientUrlEnv
  .split(",")
  .map((u) => normalize(u))
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (server-to-server, curl, postman)
      if (!origin) return callback(null, true);
      const normalizedOrigin = normalize(origin);
      // if no CLIENT_URL configured, allow any origin
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
