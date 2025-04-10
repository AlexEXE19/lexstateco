const db = require("../config/db");

db.query("CREATE DATABASE IF NOT EXISTS realestate_db", (err, result) => {
  if (err) {
    console.error("Error creating database: ", err);
    return;
  }
  console.log("Database 'realestate_db' is ready.");

  db.query("USE realestate_db", (err, result) => {
    if (err) {
      console.error("Error selecting database: ", err);
      return;
    }
    console.log("Using 'realestate_db' database.");

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL
      );
    `;
    db.query(createUsersTable, (err, result) => {
      if (err) {
        console.error("Error creating users table: ", err);
        return;
      }
      console.log("Users table created or already exists.");
    });

    const createPropertiesTable = `
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        image_url VARCHAR(255) DEFAULT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        size INT NOT NULL,
        distance VARCHAR(255) NOT NULL,
        seller_id INT NOT NULL,
        FOREIGN KEY (seller_id) REFERENCES users(id)
      );
    `;
    db.query(createPropertiesTable, (err, result) => {
      if (err) {
        console.error("Error creating properties table: ", err);
        return;
      }
      console.log("Properties table created or already exists.");
    });

    const createSavedPropertiesTable = `
      CREATE TABLE IF NOT EXISTS saved_properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        property_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (property_id) REFERENCES properties(id)
      );
    `;
    db.query(createSavedPropertiesTable, (err, result) => {
      if (err) {
        console.error("Error creating saved_properties table: ", err);
        return;
      }
      console.log("Saved properties table created or already exists.");
    });
  });
});
