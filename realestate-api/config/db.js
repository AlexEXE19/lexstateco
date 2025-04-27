require("dotenv").config(); // Load environment variables

const mysql = require("mysql2");

// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Use the host from the .env file
  user: process.env.DB_USER, // Use the user from the .env file
  password: process.env.DB_PASSWORD, // Use the password from the .env file
  database: process.env.DB_NAME, // Use the database name from the .env file
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err);
    process.exit(1);
  }
  console.log("Connected to the database");
});

module.exports = db; // Export the db connection
