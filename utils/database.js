const { Sequelize } = require("sequelize");

require("dotenv").config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.SEQUELIZE_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

module.exports = db;
