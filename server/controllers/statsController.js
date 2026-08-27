const { User, Property } = require("../models");

// In-memory ratings store (reset on restart)
let ratings = [];

const average = () =>
  ratings.length
    ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
    : 0;

// Stats endpoint: user count, property count, average rating
const getStats = async (req, res) => {
  const [users, properties] = await Promise.all([
    User.count(),
    Property.count(),
  ]);
  res.json({
    users,
    properties,
    rating: average(),
    totalRatings: ratings.length,
  });
};

// Feedback endpoint: accept rating 1-5, update average
const postFeedback = (req, res) => {
  const value = Number(req.body?.rating);
  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }
  ratings.push(value);
  res.json({ ratingAverage: average(), totalRatings: ratings.length });
};

module.exports = { getStats, postFeedback };
