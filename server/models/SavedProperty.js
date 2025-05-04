const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Property = require("./Property");

const SavedProperty = sequelize.define(
  "SavedProperty",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    property_id: {
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
    underscored: true,
    tableName: "saved_properties",
  }
);

// Overwriting function - used for parsing from "snake case" to "camel case"
SavedProperty.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  values.userId = values.user_id;
  delete values.user_id;

  values.propertyId = values.property_id;
  delete values.property_id;

  return values;
};

module.exports = SavedProperty;
