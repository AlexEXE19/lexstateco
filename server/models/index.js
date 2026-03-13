const sequelize = require("../config/db");

const User = require("./User");
const Property = require("./Property");
const SavedProperty = require("./SavedProperty");
const TourRequest = require("./TourRequest");

// Defining the relationships
User.hasMany(Property, { foreignKey: "seller_id" });
Property.belongsTo(User, { foreignKey: "seller_id" });

Property.hasMany(SavedProperty, { foreignKey: "property_id" });
SavedProperty.belongsTo(Property, { foreignKey: "property_id" });

User.hasMany(SavedProperty, { foreignKey: "user_id" });
SavedProperty.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(TourRequest, { as: "incomingTours", foreignKey: "seller_id" });
User.hasMany(TourRequest, { as: "sentTours", foreignKey: "requester_id" });
TourRequest.belongsTo(User, { as: "seller", foreignKey: "seller_id" });
TourRequest.belongsTo(User, { as: "requester", foreignKey: "requester_id" });

Property.hasMany(TourRequest, { foreignKey: "property_id" });
TourRequest.belongsTo(Property, { foreignKey: "property_id" });

module.exports = {
  sequelize,
  User,
  Property,
  SavedProperty,
  TourRequest,
};
