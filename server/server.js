require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { sequelize } = require("./models/index");

const userRoutes = require("./routes/users");
const propertyRoutes = require("./routes/properties");
const savedPropertiesRoutes = require("./routes/savedProperties");

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Register route middleware for handling user, property, and saved property endpoints
app.use("/users/", userRoutes);
app.use("/properties/", propertyRoutes);
app.use("/saved-properties/", savedPropertiesRoutes);

// Syncs Sequelize models with the database, altering tables to match models
(async () => {
  try {
    await sequelize.sync();
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Unable to sync database:", error);
  }
})();

app.get("/", (req, res) => {
  res.send("Welcome to the Property and User Management API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
