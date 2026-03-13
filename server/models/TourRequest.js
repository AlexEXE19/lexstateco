const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TourRequest = sequelize.define(
  "TourRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requested_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      // string to avoid enum alteration issues; validation enforced in controller
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: "tour_requests",
  },
);

// Ensure camelCase fields on responses
TourRequest.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  values.propertyId = values.property_id;
  delete values.property_id;

  values.sellerId = values.seller_id;
  delete values.seller_id;

  values.requesterId = values.requester_id;
  delete values.requester_id;

  values.requestedAt = values.requested_at;
  delete values.requested_at;

  return values;
};

module.exports = TourRequest;
