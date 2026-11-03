const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Item = sequelize.define("Item", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "lost"
  }
});

module.exports = Item;