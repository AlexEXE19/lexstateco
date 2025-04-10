const db = require("../config/db");

const getUserById = (req, res) => {
  const { id } = req.params;
  console.log("User ID:", id);

  const query = `SELECT * FROM users WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error getting the user: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    console.log("Query result:", result);

    if (result.length === 0) {
      return res.status(404).json({ message: "No user found with this ID" });
    }

    const user = result[0];
    const camelCaseUser = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      password: user.password,
      phone: user.phone,
    };

    // Send the response with camelCase keys
    res.json(camelCaseUser);
  });
};

const getUserByEmail = (req, res) => {
  const { email } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;

  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("Error getting the user: ", err);
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "There are no users with this email" });
    }

    res.json({ message: "Got the user succcessfully" });
  });
};

const authenticateUser = (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Error getting the user's credentials: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "There are no users with these credentials" });
    }

    const user = result[0];
    res.json({ message: "Got the user's credentials successfully", user });
  });
};

const createUser = (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const query = `
      INSERT INTO users (first_name, last_name, email, password, phone)
      VALUES (?, ?, ?, ?, ?)
    `;

  db.query(
    query,
    [firstName, lastName, email, password, phone],
    (err, result) => {
      if (err) {
        console.error("Error creating user: ", err);
        return res
          .status(500)
          .json({ message: "An error occurred while adding the user." });
      }

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: result.insertId,
          firstName,
          lastName,
          email,
          password,
        },
      });
    }
  );
};

const updateUserPassword = (req, res) => {
  const { email, password } = req.body;

  const query = `UPDATE users SET password = ? WHERE email = ?`;

  db.query(query, [password, email], (err, result) => {
    if (err) {
      console.error("Error updating user password: ", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User's password updated successfully" });
  });
};

const deleteUserProperty = (req, res) => {
  const { userId, propertyId } = req.body;
  const query =
    "DELETE FROM user_saved_properties WHERE user_id = ? AND property_id = ?";

  db.query(query, [userId, propertyId], (err, result) => {
    if (err) {
      console.error("Error deleting user properties: ", err);
      return callback(err, null);
    }

    if (result.affectedRows === 0) {
      console.log("No properties to delete for user ID: ", userId);
    }

    callback(null, result);
  });
};

module.exports = {
  getUserById,
  getUserByEmail,
  authenticateUser,
  createUser,
  updateUserPassword,
  deleteUserProperty,
};
