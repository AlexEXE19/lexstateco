const { User } = require("../models");
const bcrypt = require("bcrypt");

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "No user found with this ID" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error getting the user: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user by his email - not used yet, subject to removal
const getUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "There are no users with this email" });
    }

    res.json({ message: "Got the user successfully", user });
  } catch (err) {
    console.error("Error getting the user: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Authenticate user
const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
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

    res.json({ message: "Got the user's credentials successfully", user });
  } catch (err) {
    console.error("Error getting the user's credentials: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Register user
const createUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error("Error creating user: ", err);
    res
      .status(500)
      .json({ message: "An error occurred while adding the user." });
  }
};

// Update user password - not used yet, subject to use it via next updates
const updateUserPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "User's password updated successfully" });
  } catch (err) {
    console.error("Error updating user password: ", err);
    res.status(500).json({ message: "Database error" });
  }
};

module.exports = {
  getUserById,
  getUserByEmail,
  authenticateUser,
  createUser,
  updateUserPassword,
};
