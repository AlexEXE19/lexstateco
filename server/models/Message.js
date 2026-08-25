const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Conversation = require("./Conversation");
const User = require("./User");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Conversation,
        key: "id",
      },
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT("medium"),
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
    tableName: "messages",
  },
);

Message.prototype.toJSON = function () {
    const values = this.get();


  values.conversationId = values.conversation_id;
  delete values.conversation_id;

  values.senderId = values.sender_id;
  delete values.sender_id;

  values.createdAt = values.created_at;
  delete values.created_at;

  return values;
};

module.exports = Message;
