const sequelize = require("../config/db");

const User = require("./User");
const Property = require("./Property");
const SavedProperty = require("./SavedProperty");

// Defining the relationships
User.hasMany(Property, { foreignKey: "seller_id" });
Property.belongsTo(User, { foreignKey: "seller_id" });

Property.hasMany(SavedProperty, { foreignKey: "property_id" });
SavedProperty.belongsTo(Property, { foreignKey: "property_id" });

User.hasMany(SavedProperty, { foreignKey: "user_id" });
SavedProperty.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  User,
  Property,
  SavedProperty,
};
