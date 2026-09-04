const sequelize = require("../config/db");

const User = require("./User");
const Property = require("./Property");
const SavedProperty = require("./SavedProperty");
const TourRequest = require("./TourRequest");
const Notification = require("./Notification");
const Conversation = require("./Conversation");
const Message = require("./Message");

// Defining the relationships
// agentId on Property references User.id (the property's listing agent).
User.hasMany(Property, { foreignKey: "agentId", sourceKey: "id" });
Property.belongsTo(User, { foreignKey: "agentId", targetKey: "id" });

Property.hasMany(SavedProperty, { foreignKey: "propertyId" });
SavedProperty.belongsTo(Property, { foreignKey: "propertyId" });

User.hasMany(SavedProperty, { foreignKey: "userId" });
SavedProperty.belongsTo(User, { foreignKey: "userId" });

User.hasMany(TourRequest, { as: "incomingTours", foreignKey: "agentId" });
User.hasMany(TourRequest, { as: "sentTours", foreignKey: "requesterId" });
TourRequest.belongsTo(User, { as: "agent", foreignKey: "agentId" });
TourRequest.belongsTo(User, { as: "requester", foreignKey: "requesterId" });

User.hasMany(Notification, { as: "notifications", foreignKey: "ownerId" });
Notification.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

Property.hasMany(Conversation, { foreignKey: "propertyId" });
Conversation.belongsTo(Property, { foreignKey: "propertyId" });

User.hasMany(Conversation, {
  as: "buyerConversations",
  foreignKey: "buyerId",
});
User.hasMany(Conversation, {
  as: "agentConversations",
  foreignKey: "agentId",
});
Conversation.belongsTo(User, { as: "buyer", foreignKey: "buyerId" });
Conversation.belongsTo(User, { as: "agent", foreignKey: "agentId" });

Conversation.hasMany(Message, { foreignKey: "conversationId" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });
Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

Property.hasMany(TourRequest, { foreignKey: "propertyId" });
TourRequest.belongsTo(Property, { foreignKey: "propertyId" });

module.exports = {
  sequelize,
  User,
  Property,
  SavedProperty,
  TourRequest,
  Notification,
  Conversation,
  Message,
};
