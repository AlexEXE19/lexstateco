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
    image_refs: {
      // Stores relative paths to images in uploads/property/<propertyId>/
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    neighborhood: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip_code: {
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
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: "properties",
  },
);

// Overwriting function - used for parsing from "snake case" to "camel case"
Property.prototype.toJSON = function () {
   const values = this.get();


  values.imageRefs = values.image_refs;
  delete values.image_refs;

  values.zipCode = values.zip_code;
  delete values.zip_code;

  values.sellerId = values.seller_id;
  delete values.seller_id;

  return values;
};

module.exports = Property;
