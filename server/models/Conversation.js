const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Property = require("./Property");
const User = require("./User");

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Property,
        key: "id",
      },
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "conversations",
  },
);

Conversation.prototype.toJSON = function () {
  const values = this.get();

  values.propertyId = values.property_id;
  delete values.property_id;

  values.buyerId = values.buyer_id;
  delete values.buyer_id;

  values.sellerId = values.seller_id;
  delete values.seller_id;

  if (values.updated_at) {
    values.updatedAt = values.updated_at;
    delete values.updated_at;
  }

  return values;
};

module.exports = Conversation;
