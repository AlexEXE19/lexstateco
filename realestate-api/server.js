require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const userRoutes = require("./routes/users");
const propertyRoutes = require("./routes/properties");
const savedPropertiesRoutes = require("./routes/savedProperties");

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/users/", userRoutes);
app.use("/properties/", propertyRoutes);
app.use("/saved-properties/", savedPropertiesRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Property and User Management API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
