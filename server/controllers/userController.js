const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const signUserToken = (userPayload) =>
  jwt.sign(userPayload, JWT_SECRET, { expiresIn: "7d" });

const toSafeUser = (user) => {
  const safeUser = typeof user.toJSON === "function" ? user.toJSON() : user;
  delete safeUser.password;
  return safeUser;
};

// Get all users (used by MyAudienceTab)
const getAllUsers = async (_req, res) => {
  const users = await User.findAll();
  res.json(users.map(toSafeUser));
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: "No user found with this ID" });
  }

  res.json(toSafeUser(user));
};

// Get user by email (query param)
const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email query param is required" });
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res
      .status(404)
      .json({ message: "There are no users with this email" });
  }

  res.json({ message: "Got the user successfully", user: toSafeUser(user) });
};

// Authenticate user
const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res
      .status(404)
      .json({ message: "There are no users with these credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const safeUser = toSafeUser(user);

  const token = signUserToken({
    id: safeUser.id,
    firstName: safeUser.firstName,
    lastName: safeUser.lastName,
    email: safeUser.email,
    phone: safeUser.phone,
  });

  res.json({
    message: "Got the user's credentials successfully",
    user: safeUser,
    token,
  });
};

// Register user
const createUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
  });
  const safeUser = toSafeUser(user);

  const token = signUserToken({
    id: safeUser.id,
    firstName: safeUser.firstName,
    lastName: safeUser.lastName,
    email: safeUser.email,
    phone: safeUser.phone,
  });

  res.status(201).json({
    message: "User created successfully",
    user: safeUser,
    token,
  });
};

// Update the authenticated user's own password. Requires the current
// password so a stolen/guessed session token alone can't lock the real
// owner out.
const updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "currentPassword and newPassword are required" });
  }

  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentValid) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "User's password updated successfully" });
};

const updateUserFeedbackRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.feedbackRating = rating;

  await user.save();

  res.status(200).json({
    message: "Feedback rating updated successfully",
  });
};
module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  authenticateUser,
  createUser,
  updateUserPassword,
  updateUserFeedbackRating,
};
