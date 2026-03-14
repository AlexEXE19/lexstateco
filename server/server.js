require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models/index");

const userRoutes = require("./routes/users");
const propertyRoutes = require("./routes/properties");
const savedPropertiesRoutes = require("./routes/savedProperties");
const tourRequestRoutes = require("./routes/tourRequests");
const notificationRoutes = require("./routes/notifications");
const conversationRoutes = require("./routes/conversations");

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 3000;

// Register route middleware for handling user, property, and saved property endpoints
app.use("/users/", userRoutes);
app.use("/properties/", propertyRoutes);
app.use("/saved-properties/", savedPropertiesRoutes);
app.use("/tour-requests/", tourRequestRoutes);
app.use("/notifications/", notificationRoutes);
app.use("/conversations/", conversationRoutes);

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
