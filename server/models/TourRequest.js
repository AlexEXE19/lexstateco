const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const STATUS_VALUES = ["pending", "accepted", "rejected", "canceled"];

const TourRequest = sequelize.define(
  "TourRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    agentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requestedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...STATUS_VALUES),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    timestamps: false,
    tableName: "tour_requests",
  },
);

TourRequest.STATUS_VALUES = STATUS_VALUES;

module.exports = TourRequest;
