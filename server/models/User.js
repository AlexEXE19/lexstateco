const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: "users",
  }
);

// Overwriting function - used for parsing from "snake case" to "camel case"
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  values.firstName = values.first_name;
  delete values.first_name;

  values.lastName = values.last_name;
  delete values.last_name;

  return values;
};

module.exports = User;
