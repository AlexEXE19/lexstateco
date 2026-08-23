const express = require("express");
const router = express.Router();

const {
  getStats,
  postFeedback,
} = require("../controllers/statsController");

router.get("/", getStats)
router.post("/feedback", postFeedback)

module.exports = router;
