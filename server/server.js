require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models/index");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const propertyRoutes = require("./routes/properties");
const savedPropertiesRoutes = require("./routes/savedProperties");
const tourRequestRoutes = require("./routes/tourRequests");
const notificationRoutes = require("./routes/notifications");
const conversationRoutes = require("./routes/conversations");
const statsRoutes = require("./routes/stats");
const curatedRoutes = require("./routes/curated");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 3000;

// Register route middleware for handling user, property, and saved property endpoints
app.use("/auth/", authRoutes);
app.use("/users/", userRoutes);
app.use("/properties/", propertyRoutes);
app.use("/saved-properties/", savedPropertiesRoutes);
app.use("/tour-requests/", tourRequestRoutes);
app.use("/notifications/", notificationRoutes);
app.use("/conversations/", conversationRoutes);
app.use("/stats/", statsRoutes);
app.use("/curated/", curatedRoutes);

// Syncs Sequelize models with the database, altering tables to match models
(async () => {
  try {
    await sequelize.sync();
    // location is JSONB - a functional index on the city path isn't
    // expressible through Sequelize's declarative model `indexes` option,
    // so it's created directly.
    await sequelize.query(
      `CREATE INDEX IF NOT EXISTS properties_location_city_idx ON properties ((location->>'city'))`,
    );
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Unable to sync database:", error);
  }
})();

app.get("/", (req, res) => {
  res.send("Welcome to the Property and User Management API");
});

// Must be registered after every other app.use()/route - Express only
// routes a request here once something calls next(err).
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
