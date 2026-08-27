const express = require("express");
const router = express.Router();

const {
  getStats,
  postFeedback,
} = require("../controllers/statsController");
const catchAsync = require("../middlewares/catchAsync");

router.get("/", catchAsync(getStats))
router.post("/feedback", catchAsync(postFeedback))

module.exports = router;
