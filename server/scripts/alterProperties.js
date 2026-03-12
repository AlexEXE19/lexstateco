require("dotenv").config();
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

async function ensureColumn(queryInterface, table, column, definition) {
  try {
    await queryInterface.addColumn(table, column, definition);
    console.log(`Added column ${column}`);
  } catch (err) {
    if (
      err?.original?.code === "ER_DUP_FIELDNAME" ||
      /Duplicate column/.test(err.message)
    ) {
      console.log(`Column ${column} already exists, skipping.`);
    } else {
      throw err;
    }
  }
}

async function dropIfExists(queryInterface, table, column) {
  try {
    await queryInterface.removeColumn(table, column);
    console.log(`Dropped column ${column}`);
  } catch (err) {
    if (
      err?.original?.code === "ER_CANT_DROP_FIELD_OR_KEY" ||
      /Check that column exists/.test(err.message)
    ) {
      console.log(`Column ${column} not present, skipping.`);
    } else {
      console.log(`Could not drop ${column}: ${err.message}`);
    }
  }
}

async function run() {
  const queryInterface = sequelize.getQueryInterface();
  const table = "properties";

  await ensureColumn(queryInterface, table, "image_refs", {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  });

  await ensureColumn(queryInterface, table, "neighborhood", {
    type: DataTypes.STRING(191),
    allowNull: false,
    defaultValue: "",
  });

  await ensureColumn(queryInterface, table, "zip_code", {
    type: DataTypes.STRING(32),
    allowNull: false,
    defaultValue: "",
  });

  await dropIfExists(queryInterface, table, "distance");
  await dropIfExists(queryInterface, table, "image_data");

  await sequelize.close();
  console.log("Migration complete.");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  sequelize.close();
  process.exit(1);
});
