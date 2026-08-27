// Central place that turns a thrown/rejected error into a response. Only
// errors a controller didn't already handle end up here - most controllers
// still return their own 400/403/404s directly, since those are expected
// control flow, not exceptions.
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "That value is already in use." });
  }

  if (err.name === "SequelizeValidationError") {
    const detail = err.errors?.[0]?.message;
    return res.status(400).json({ message: detail || "Invalid data." });
  }

  return res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
