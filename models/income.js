const { DataTypes } = require("sequelize");
const db = require("../utils/databse");
const Income = db.define("income", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
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
