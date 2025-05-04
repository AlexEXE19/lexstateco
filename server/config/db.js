require("dotenv").config();
const { Sequelize } = require("sequelize");

// Instantiating a Sequelize object with the environment variables from .env file
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Immediately Invoked Async Function Expression (IIFE) to test the Sequelize database connection on startup
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database with Sequelize.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
})();

module.exports = sequelize;
