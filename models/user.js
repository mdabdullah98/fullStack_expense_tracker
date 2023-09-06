const { DataTypes } = require("sequelize");
const db = require("../utils/databse");
const User = db.define("user", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  psw: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: DataTypes.TEXT,
});
module.exports = User;
