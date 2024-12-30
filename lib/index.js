let sq = require("sequelize");

let sequelize = new sq.Sequelize({
  dialect: "sqlite",
  storage: "./BD5.5/database.sqlite",
});

module.exports = { Datatypes: sq.DataTypes, sequelize };
