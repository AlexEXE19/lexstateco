const locationTags = require("../data/locationTags");

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Picks 3 distinct random tags and one random location out of each, for
// the "Curated for today" strip on the properties page.
const getCuratedPicks = (req, res) => {
  const tagNames = Object.keys(locationTags);
  const shuffled = [...tagNames].sort(() => Math.random() - 0.5);
  const picks = shuffled.slice(0, 3).map((tag) => ({
    tag,
    location: pickRandom(locationTags[tag]),
  }));

  res.json(picks);
};

module.exports = { getCuratedPicks };
