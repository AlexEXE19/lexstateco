require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { sequelize, User, Property } = require("./models/index");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const propertyRoutes = require("./routes/properties");
const savedPropertiesRoutes = require("./routes/savedProperties");
const tourRequestRoutes = require("./routes/tourRequests");
const notificationRoutes = require("./routes/notifications");
const conversationRoutes = require("./routes/conversations");

// In-memory ratings store (reset on restart)
let ratings = [];

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

// Stats endpoint: user count, property count, average rating
app.get("/stats", async (req, res) => {
  try {
    const [users, properties] = await Promise.all([
      User.count(),
      Property.count(),
    ]);
    const average = ratings.length
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
      : 0;
    res.json({
      users,
      properties,
      rating: average,
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error("Failed to load stats", error);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

// Feedback endpoint: accept rating 1-5, update average
app.post("/feedback/rating", (req, res) => {
  const value = Number(req.body?.rating);
  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }
  ratings.push(value);
  const average = Number(
    (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2),
  );
  res.json({ ratingAverage: average, totalRatings: ratings.length });
});

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
