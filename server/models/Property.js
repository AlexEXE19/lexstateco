const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

// Placeholder set - the user owns the final status vocabulary, this just
// wires up the enum mechanism.
const PROPERTY_STATUS_VALUES = ["available", "pending", "sold"];

const PROPERTY_TYPE_VALUES = [
  "apartment",
  "villa",
  "penthouse",
  "studio",
  "townhouse",
  "bungalow",
  "cottage",
  "loft",
  "farmhouse",
  "treehouse",
  "houseboat",
  "chalet",
];

const AMENITY_VALUES = [
  "swimmingPool",
  "garage",
  "garden",
  "fireplace",
  "homeGym",
  "sauna",
  "rooftopTerrace",
  "smartHomeSystem",
  "wineCellar",
  "homeCinema",
  "petFriendly",
  "elevator",
  "seaView",
  "mountainView",
  "solarPanels",
  "evCharger",
  "concierge",
  "coworkingSpace",
  "walkInCloset",
  "securitySystem",
];

const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageRefs: {
      // Stores relative paths to images in uploads/property/<propertyId>/
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    // { country, city, neighborhood, address, zipCode } - indexed on
    // location.city via a functional index, see server.js.
    location: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(...PROPERTY_STATUS_VALUES),
      allowNull: false,
      defaultValue: "available",
    },
    type: {
      type: DataTypes.ENUM(...PROPERTY_TYPE_VALUES),
      allowNull: false,
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.ENUM(...AMENITY_VALUES)),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    timestamps: false,
    tableName: "properties",
  },
);

Property.STATUS_VALUES = PROPERTY_STATUS_VALUES;
Property.TYPE_VALUES = PROPERTY_TYPE_VALUES;
Property.AMENITY_VALUES = AMENITY_VALUES;

module.exports = Property;
