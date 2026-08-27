const express = require("express");
const router = express.Router();

const { getStats, postFeedback } = require("../controllers/statsController");
const catchAsync = require("../middlewares/catchAsync");

// Get user and property counts and average feedback rating
router.get("/summary", catchAsync(getStats));

module.exports = router;
