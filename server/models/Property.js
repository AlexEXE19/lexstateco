const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_data: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distance: {
      type: DataTypes.ENUM("City Center", "Around the Center", "Suburbs"),
      allowNull: false,
    },
    seller_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: "properties",
  }
);

// Overwriting function - used for parsing from "snake case" to "camel case"
Property.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  values.sellerId = values.seller_id;
  delete values.seller_id;

  return values;
};

module.exports = Property;
