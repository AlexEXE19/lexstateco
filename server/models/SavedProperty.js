const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Property = require("./Property");

const SavedProperty = sequelize.define(
  "SavedProperty",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    propertyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Property,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "saved_properties",
  },
);

module.exports = SavedProperty;
