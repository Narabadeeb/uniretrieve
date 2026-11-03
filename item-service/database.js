const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "uniretrieve",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "uniretrieve123",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3308,
    dialect: "mysql"
  }
);

module.exports = sequelize;