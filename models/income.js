const { DataTypes } = require("sequelize");
const db = require("../utils/databse");
const Income = db.define("income", {
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
    allowNull: false,
  },

  earnings: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  describe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = Income;
