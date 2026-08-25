const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
    type: {
      // incoming_request | request_update
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: "notifications",
  },
);

Notification.prototype.toJSON = function () {
    const values = this.get();


  values.ownerId = values.owner_id;
  delete values.owner_id;

  values.timestamp = values.created_at;
  delete values.created_at;

  return values;
};

module.exports = Notification;
