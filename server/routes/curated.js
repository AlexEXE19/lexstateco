const express = require("express");
const router = express.Router();

const { getCuratedPicks } = require("../controllers/curatedController");
const catchAsync = require("../middlewares/catchAsync");

// Public - same audience as browsing properties.
router.get("/today", catchAsync(getCuratedPicks));

module.exports = router;
