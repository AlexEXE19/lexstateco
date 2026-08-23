const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Verifies the bearer token and attaches its payload as req.user. Doesn't
// by itself check that req.user is allowed to touch the resource being
// requested - controllers use assertSelf (or their own ownership lookup)
// for that, since "who you are" and "what you're allowed to touch" are
// different checks.
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Rejects with 403 unless the authenticated user's id matches `id`
// (a route param or body field identifying whose data is being touched).
// Returns whether the request is allowed to continue.
const assertSelf = (req, res, id) => {
  if (String(req.user.id) !== String(id)) {
    res.status(403).json({ message: "Not allowed" });
    return false;
  }
  return true;
};

module.exports = { requireAuth, assertSelf };
