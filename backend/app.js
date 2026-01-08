const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
//const recipeRoutes = require("./routes/recipes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api/auth", authRoutes);
//app.use("/api/recipes", recipeRoutes);

// Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

module.exports = app;
